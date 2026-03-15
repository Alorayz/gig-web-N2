import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import api from './api';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Register for push notifications and get token
export async function registerForPushNotificationsAsync(): Promise<string | null> {
  let token: string | null = null;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'GIG ZipFinder',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF6B35',
    });

    await Notifications.setNotificationChannelAsync('zip-codes', {
      name: 'New Zip Codes',
      description: 'Notifications when new zip codes are available',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#00D4AA',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return null;
    }
    
    try {
      const projectId = '485bf0a5-92ae-4f9b-89a3-ae4e6762b002';
      token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
      console.log('Push token:', token);
    } catch (error) {
      console.log('Error getting push token:', error);
    }
  } else {
    console.log('Must use physical device for Push Notifications');
  }

  return token;
}

// Save push token to backend
export async function savePushToken(deviceId: string, pushToken: string): Promise<void> {
  try {
    await api.post('/notifications/register', {
      device_id: deviceId,
      push_token: pushToken,
      platform: Platform.OS,
    });
    console.log('Push token saved to backend');
  } catch (error) {
    console.log('Error saving push token:', error);
  }
}

// Schedule local notification for purchase expiration
export async function scheduleExpirationReminder(appName: string, expiresAt: number): Promise<void> {
  const now = Date.now();
  const timeUntilExpiration = expiresAt - now;
  
  // Remind 2 hours before expiration
  const reminderTime = timeUntilExpiration - (2 * 60 * 60 * 1000);
  
  if (reminderTime > 0) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Your access is expiring soon!',
        body: `Your ${appName} zip codes access expires in 2 hours. Check them now!`,
        data: { appName, type: 'expiration_reminder' },
      },
      trigger: {
        seconds: Math.floor(reminderTime / 1000),
      },
    });
    console.log(`Scheduled expiration reminder for ${appName}`);
  }
}

// Send immediate local notification
export async function sendLocalNotification(
  title: string, 
  body: string, 
  data?: Record<string, any>
): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data: data || {},
    },
    trigger: null, // Immediate
  });
}

// Cancel all scheduled notifications
export async function cancelAllNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

// Listen for notification responses
export function addNotificationResponseListener(
  callback: (response: Notifications.NotificationResponse) => void
): Notifications.Subscription {
  return Notifications.addNotificationResponseReceivedListener(callback);
}

// Listen for received notifications
export function addNotificationReceivedListener(
  callback: (notification: Notifications.Notification) => void
): Notifications.Subscription {
  return Notifications.addNotificationReceivedListener(callback);
}
