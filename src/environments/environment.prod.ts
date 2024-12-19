export const environment = {
    production: true,
    enableImageDebugging: true,
    buildTimestamp: Date.now(),
    firebase: {
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
      apiKey: 'bdc9a4fc17b76e6a40e3f7168a2d1188',
      apiSecretKey: '0bd9a2cd26ae0e1bb7f04ba01f863868',
      shopName: 'blind-barrels.myshopify.com',
      redirectUri: 'https://whiskeywiz2.web.app/auth/callback',
      apiUrl: 'https://blind-barrels.myshopify.com/admin/api/2024-01'
    }
  };