import { BleScannerService } from './BleScannerService';
import { BleBroadcasterService } from './BleBroadcasterService';

class MeshDutyCycle {
  private isRelaying = false;
  private intervalId: ReturnType<typeof setTimeout> | null = null;
  private currentRelayData: { intentFlag: number; hashedDid: string; timestamp: number; hopCount: number } | null = null;

  startRelay(intentFlag: number, hashedDid: string, timestamp: number, hopCount: number) {
    if (this.isRelaying) return; // Only relay one at a time for now to prevent overlapping duty cycles

    this.isRelaying = true;
    this.currentRelayData = { intentFlag, hashedDid, timestamp, hopCount };
    
    // Initial cycle start
    this.cycle();
  }

  stopRelay() {
    this.isRelaying = false;
    this.currentRelayData = null;
    if (this.intervalId) {
      clearTimeout(this.intervalId);
      this.intervalId = null;
    }
    BleBroadcasterService.stopBeacon();
    BleScannerService.startScanning(); // ensure scanner is back on
  }

  private cycle = async () => {
    if (!this.isRelaying || !this.currentRelayData) return;

    // 1. Scan for 3 seconds
    BleBroadcasterService.stopBeacon();
    BleScannerService.startScanning();
    
    await this.delay(3000);
    
    if (!this.isRelaying) return;

    // 2. Pause Scanner
    BleScannerService.stopScanning();

    // 3. Broadcast for 2 seconds
    await BleBroadcasterService.startRelayBeacon(
      this.currentRelayData.intentFlag,
      this.currentRelayData.hashedDid,
      this.currentRelayData.timestamp,
      this.currentRelayData.hopCount
    );

    await this.delay(2000);

    // Loop
    if (this.isRelaying) {
      this.cycle();
    }
  }

  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const MeshDutyCycleManager = new MeshDutyCycle();
