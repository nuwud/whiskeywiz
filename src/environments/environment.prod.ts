export const environment = {
  production: true,
  enableImageDebugging: false,
  buildTimestamp: Date.now(),
  firebase: {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: "whiskeywiz2.firebaseapp.com",
    databaseURL: "https://whiskeywiz2-default-rtdb.firebaseio.com",
    projectId: "whiskeywiz2",
    storageBucket: "whiskeywiz2.appspot.com",
    messagingSenderId: "555320797929",
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID
  },
  shopify: {
    apiUrl: 'https://blind-barrels.myshopify.com/admin/api/2024-01'
  }
};