// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCqZMaGpJGf5veYgTXmytg1bLerva-of0U",
    authDomain: "whiskeywiz2.firebaseapp.com",
    databaseURL: "https://whiskeywiz2-default-rtdb.firebaseio.com",
    projectId: "whiskeywiz2",
    storageBucket: "whiskeywiz2.appspot.com",
    messagingSenderId: "555320797929",
    appId: "1:555320797929:web:0d4b062d7f2ab330fc1e78",
    measurementId: "G-SK0TJJEPF5"
  };
  
  // Wait for the firebase module to be available
  function initializeFirebase() {
    if (typeof firebase !== 'undefined') {
      firebase.initializeApp(firebaseConfig);
    } else {
      setTimeout(initializeFirebase, 50);
    }
  }
  
  initializeFirebase();