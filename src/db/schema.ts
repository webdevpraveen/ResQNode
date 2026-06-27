import { appSchema, tableSchema } from '@nozbe/watermelondb';

export const schema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'mesh_nodes',
      columns: [
        { name: 'hashed_did', type: 'string' },
        { name: 'last_rssi', type: 'number' },
        { name: 'estimated_distance', type: 'number' },
        { name: 'last_seen_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'emergency_beacons',
      columns: [
        { name: 'origin_did', type: 'string' },
        { name: 'intent_flag', type: 'number' },
        { name: 'hop_count', type: 'number' },
        { name: 'status', type: 'string' },
        { name: 'created_at', type: 'number' },
        { name: 'synced_to_cloud', type: 'boolean' },
      ],
    }),
  ],
});
