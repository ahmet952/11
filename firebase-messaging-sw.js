// firebase-messaging-sw.js

importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyAwFWM-YqQBuvjvAQ3dMFbPhSgOHuvyAqk",
  authDomain: "plan-bd9d8.firebaseapp.com",
  projectId: "plan-bd9d8",
  storageBucket: "plan-bd9d8.firebasestorage.app",
  messagingSenderId: "501991214743",
  appId: "1:501991214743:web:4e6d5deacba7b4ffa363d2",
  measurementId: "G-B4P9EDH14F"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Arka planda mesaj alındı:', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/alarm-icon.png'  // İstersen kendi ikonunu koyabilirsin
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
