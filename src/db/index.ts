import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { schema } from './schema';
import { MeshNode } from './models/MeshNode';
import { EmergencyBeacon } from './models/EmergencyBeacon';

const adapter = new SQLiteAdapter({
  schema,
  jsi: true, /* Enable synchronous SQLite operations for speed */
  onSetUpError: error => {
    console.error('Database setup error', error);
  }
});

export const database = new Database({
  adapter,
  modelClasses: [
    MeshNode,
    EmergencyBeacon,
  ],
});
