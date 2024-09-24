// Import Firebase scripts
importScripts('https://www.gstatic.com/firebasejs/9.6.10/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging-compat.js');

// Initialize Firebase in service worker (replace with your Firebase config)
firebase.initializeApp({
  apiKey: "AIzaSyBxGZvrzOf3bFmJXnu69ZYSxFCiZWA0raE",
  authDomain: "task-manager-app-c0d0a.firebaseapp.com",
  projectId: "task-manager-app-c0d0a",
  storageBucket: "task-manager-app-c0d0a.appspot.com",
  messagingSenderId: "256522881699",
  appId: "1:256522881699:web:1a66df077279201ef24d16",
  measurementId: "G-RLKLL7JG00"
});

// Retrieve Firebase Messaging object
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/firebase-logo.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
