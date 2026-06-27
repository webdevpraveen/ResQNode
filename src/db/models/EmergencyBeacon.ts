import { Model } from '@nozbe/watermelondb';
import { field, date } from '@nozbe/watermelondb/decorators';

export class EmergencyBeacon extends Model {
  static table = 'emergency_beacons';

  @field('origin_did') originDid: string;
  @field('intent_flag') intentFlag: number;
  @field('hop_count') hopCount: number;
  @field('status') status: string; // 'active' | 'resolved'
  @date('created_at') createdAt: Date;
  @field('synced_to_cloud') syncedToCloud: boolean;
}
