# ResQNode: Setup & Architecture Guide

Welcome to the **ResQNode** repository! This project is an offline-first, Bluetooth LE (BLE) mesh survival network built with React Native, WatermelonDB, and Native BLE implementations.

This guide explains how the Cloud Synchronization engine works and how you can configure the backend.

---

## ☁️ Current Backend: Firebase (Default)

By default, ResQNode uses **Firebase Firestore** as its cloud sync engine. When a node detects an internet connection, it dumps its local offline WatermelonDB cache to Firestore.

### 📉 The Firebase Quota-Saver Hack
Firebase charges based on **Document Writes**. In a disaster scenario, a mesh node might collect 5,000 BLE SOS logs. Writing 5,000 separate documents would instantly eat up the free tier quota.

**How we solved this:**
Instead of writing each SOS log as a new document, ResQNode uses a "Daily Aggregation" strategy. The app compiles all unsynced SOS logs into a JSON Array and updates a single Firestore document for that specific device/day. 
*Result:* Pushing 1,000 logs counts as **1 Document Write** instead of 1,000.

### Setting up Firebase:
1. Create a project at [Firebase Console](https://console.firebase.google.com/).
2. Enable Firestore (Test Mode for development).
3. Download your `google-services.json` (Android) and `GoogleService-Info.plist` (iOS) and place them in the project root.
4. Run the app: `npx expo run:android`

---

## 🐘 Switching to Supabase (SQL Alternative)

Because ResQNode uses **WatermelonDB (SQLite)** locally, transitioning to a relational cloud database like **Supabase (PostgreSQL)** is incredibly native and highly recommended for large-scale production deployments.

If you are forking this repo and want to use Supabase instead of Firebase, follow these steps:

### 1. Install Dependencies
Remove Firebase and install the Supabase client:
```bash
npm uninstall @react-native-firebase/app @react-native-firebase/firestore
npm install @supabase/supabase-js
```

### 2. Update Environment Variables
Create a `.env` file in the root directory:
```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Refactor `CloudSyncService.ts`
Replace the Firestore batching logic with Supabase Bulk Upserts. Modify your sync function to look like this:

```typescript
import { supabase } from '../lib/supabase';

export async function syncToSupabase(unsyncedBeacons) {
  // Supabase allows massive bulk inserts natively
  const { data, error } = await supabase
    .from('emergency_beacons')
    .upsert(unsyncedBeacons, { onConflict: 'origin_did' });

  if (error) {
    console.error('Supabase Sync Failed:', error);
    return false;
  }
  
  return true; // Mark local records as synced_to_cloud = true
}
```

### 4. Supabase Schema Requirements
Ensure you create the following table in your Supabase SQL Editor:
```sql
CREATE TABLE emergency_beacons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  origin_did TEXT UNIQUE,
  intent_flag INTEGER,
  hop_count INTEGER,
  status TEXT,
  created_at TIMESTAMP WITH TIME ZONE
);
```
