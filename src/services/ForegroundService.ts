import notifee, { AndroidColor } from '@notifee/react-native';
import { BleScannerService } from './BleScannerService';

export const ForegroundService = {
  start: async () => {
    // Create a channel required for Android 8+
    const channelId = await notifee.createChannel({
      id: 'resqnode_scanner',
      name: 'ResQNode Mesh Scanner',
      vibration: false,
    });

    // Display the persistent notification
    await notifee.displayNotification({
      title: 'ResQNode Mesh Active',
      body: 'Scanning for offline SOS signals...',
      android: {
        channelId,
        asForegroundService: true,
        color: '#008577',
        colorized: true,
        ongoing: true,
        smallIcon: 'ic_launcher', // default react-native icon
      },
    });

    // Start BLE scanning
    BleScannerService.startScanning();
  },

  stop: async () => {
    await notifee.stopForegroundService();
    BleScannerService.stopScanning();
  },
};

// Register background task for Notifee
notifee.registerForegroundService((notification) => {
  return new Promise(() => {
    // Service remains running until stopForegroundService is called
    BleScannerService.startScanning();
  });
});
