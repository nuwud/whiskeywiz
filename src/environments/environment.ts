export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyCqZMaGpJGf5veYgTXmytg1bLerva-of0U',
    authDomain: 'whiskeywiz2.firebaseapp.com',
    databaseURL: 'https://whiskeywiz2-default-rtdb.firebaseio.com',
    projectId: 'whiskeywiz2',
    storageBucket: 'whiskeywiz2.appspot.com',
    messagingSenderId: '555320797929',
    appId: '1:555320797929:web:0d4b062d7f2ab330fc1e78',
    measurementId: 'G-SK0TJJEPF5'
  },
  useEmulators: true, // Set to false in production
  emulators: {
    auth: 'http://localhost:9099',
    firestore: 'http://localhost:8080',
    functions: 'http://localhost:5001',
    database: 'http://localhost:9000',
  }
};