import { Model } from '@nozbe/watermelondb';
import { field, date } from '@nozbe/watermelondb/decorators';

export class MeshNode extends Model {
  static table = 'mesh_nodes';

  @field('hashed_did') hashedDid: string;
  @field('last_rssi') lastRssi: number;
  @field('estimated_distance') estimatedDistance: number;
  @date('last_seen_at') lastSeenAt: Date;
}
