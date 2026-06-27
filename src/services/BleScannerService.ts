import { BleManager, Device } from 'react-native-ble-plx';
import { database } from '../db';
import { MeshNode } from '../db/models/MeshNode';
import { EmergencyBeacon } from '../db/models/EmergencyBeacon';
import { Q } from '@nozbe/watermelondb';
import { Buffer } from 'buffer';
import { MeshDutyCycleManager } from './MeshDutyCycleManager';

const BLE_MANAGER = new BleManager();
const BATCH_INTERVAL_MS = 3000;
const MANUFACTURER_ID = 0xFFFF; // As per blueprint

interface ScannedNode {
  hashedDid: string;
  rssi: number;
  distance: number;
  lastSeenAt: number;
}

class BleScanner {
  private isScanning = false;
  private nodeBuffer = new Map<string, ScannedNode>();
  private batchIntervalId: ReturnType<typeof setInterval> | null = null;
  private recentlyRelayed = new Map<string, number>();

  startScanning() {
    if (this.isScanning) return;
    this.isScanning = true;

    // Start background batch processor
    this.batchIntervalId = setInterval(() => this.processBatch(), BATCH_INTERVAL_MS);

    BLE_MANAGER.startDeviceScan(null, { allowDuplicates: true }, (error, device) => {
      if (error || !device || !device.rssi) {
        return;
      }

      const rssi = device.rssi;
      const distance = Math.pow(10, (-69 - rssi) / 20);
      
      let hashedDid = device.id; // Fallback to MAC address/UUID

      if (device.manufacturerData) {
        try {
          const buffer = Buffer.from(device.manufacturerData, 'base64');
          if (buffer.length >= 16) {
             const manufacturerId = buffer.readUInt16LE(0);
             if (manufacturerId === MANUFACTURER_ID) {
               const intentFlag = buffer.readUInt8(2);
               hashedDid = (buffer as any).subarray(3, 11).toString('hex');
               const timestamp = buffer.readInt32LE(11);
               const hopCount = buffer.readUInt8(15);
               
               // Anti-Echo logic
               if (intentFlag === 0x01) { // Medical SOS
                 const cacheKey = `${hashedDid}_${timestamp}`;
                 const lastRelayedAt = this.recentlyRelayed.get(cacheKey) || 0;
                 
                 // If not relayed in the last 60 seconds, and hop count < 4
                 if (Date.now() - lastRelayedAt > 60000 && hopCount < 4) {
                   this.recentlyRelayed.set(cacheKey, Date.now());
                   console.log(`Relaying SOS from ${hashedDid}, Hop: ${hopCount + 1}`);
                   
                   // Persist to WatermelonDB for Cloud Sync Engine
                   this.persistEmergencyBeacon(hashedDid, intentFlag, hopCount);

                   MeshDutyCycleManager.startRelay(intentFlag, hashedDid, timestamp, hopCount + 1);
                 }
               }
             }
          } else if (buffer.length >= 11) {
             // Fallback for older 15-byte sprint version
             hashedDid = (buffer as any).subarray(3, 11).toString('hex');
          }
        } catch (e) {
          // Fallback on parse failure
        }
      }

      // Update memory buffer (throttling DB writes)
      this.nodeBuffer.set(hashedDid, {
        hashedDid,
        rssi,
        distance,
        lastSeenAt: Date.now(),
      });
    });
  }

  stopScanning() {
    this.isScanning = false;
    BLE_MANAGER.stopDeviceScan();
    if (this.batchIntervalId) {
      clearInterval(this.batchIntervalId);
      this.batchIntervalId = null;
    }
    // Process remaining
    this.processBatch();
  }

  private async processBatch() {
    if (this.nodeBuffer.size === 0) return;

    // Clone and clear buffer instantly to catch new packets
    const nodesToProcess = Array.from(this.nodeBuffer.values());
    this.nodeBuffer.clear();

    const meshNodesCollection = database.get<MeshNode>('mesh_nodes');

    try {
      await database.write(async () => {
        const batchOperations = [];

        for (const node of nodesToProcess) {
          // Check if node already exists
          const existingNodes = await meshNodesCollection
            .query(Q.where('hashed_did', node.hashedDid))
            .fetch();

          if (existingNodes.length > 0) {
            // Update existing
            const existingNode = existingNodes[0];
            batchOperations.push(
              existingNode.prepareUpdate(n => {
                n.lastRssi = node.rssi;
                n.estimatedDistance = node.distance;
                n.lastSeenAt = new Date(node.lastSeenAt);
              })
            );
          } else {
            // Create new
            batchOperations.push(
              meshNodesCollection.prepareCreate(n => {
                n.hashedDid = node.hashedDid;
                n.lastRssi = node.rssi;
                n.estimatedDistance = node.distance;
                n.lastSeenAt = new Date(node.lastSeenAt);
              })
            );
          }
        }

        if (batchOperations.length > 0) {
          await database.batch(...batchOperations);
        }
      });
    } catch (error) {
      console.error('Failed to batch write BLE nodes:', error);
    }
  }

  private async persistEmergencyBeacon(hashedDid: string, intentFlag: number, hopCount: number) {
    try {
      await database.write(async () => {
        const beaconsCollection = database.get<EmergencyBeacon>('emergency_beacons');
        await beaconsCollection.create(beacon => {
          beacon.originDid = hashedDid;
          beacon.intentFlag = intentFlag;
          beacon.hopCount = hopCount;
          beacon.status = 'active';
          beacon.syncedToCloud = false;
        });
      });
    } catch (err) {
      console.error('Failed to persist beacon for cloud sync', err);
    }
  }
}

export const BleScannerService = new BleScanner();
