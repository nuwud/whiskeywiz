export const environment = {
  production: true,
  enableImageDebugging: false,
  buildTimestamp: Date.now(),
  firebase: {
    // These values are public and safe to commit
    apiKey: "AIzaSyCqZMaGpJGf5veYgTXmytg1bLerva-of0U",
    authDomain: "whiskeywiz2.firebaseapp.com",
    databaseURL: "https://whiskeywiz2-default-rtdb.firebaseio.com",
    projectId: "whiskeywiz2",
    storageBucket: "whiskeywiz2.appspot.com",
    messagingSenderId: "555320797929",
    appId: "1:555320797929:web:0d4b062d7f2ab330fc1e78",
    measurementId: "G-SK0TJJEPF5"
  },
  shopify: {
    apiUrl: 'https://blind-barrels.myshopify.com/admin/api/2024-01',
    // These will be loaded from Firebase config
    apiKey: process.env.SHOPIFY_API_KEY,
    apiSecret: process.env.SHOPIFY_API_SECRET
  }
};