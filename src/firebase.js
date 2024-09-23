// Import the functions you need from the SDKs
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBxGZvrzOf3bFmJXnu69ZYSxFCiZWA0raE",
  authDomain: "task-manager-app-c0d0a.firebaseapp.com",
  projectId: "task-manager-app-c0d0a",
  storageBucket: "task-manager-app-c0d0a.appspot.com",
  messagingSenderId: "256522881699",
  appId: "1:256522881699:web:1a66df077279201ef24d16",
  measurementId: "G-RLKLL7JG00"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Request permission for notifications
export const requestFirebaseNotificationPermission = async () => {
  try {
    await Notification.requestPermission();
    const token = await getToken(messaging, {
      vapidKey: 'BA1pMySvChywgdhvnsISUjphkB5VcoNwmGUcGQfaPNDnr71BVbdnxE4PlHwmRzNvw8zbyoTYs_WpYbsXcXT5YLM' 
    });
    console.log('FCM Token:', token);
    return token;
  } catch (error) {
    console.error('Error getting permission for notifications', error);
    throw error;
  }
};

// Listen for messages when the app is in the foreground
export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
