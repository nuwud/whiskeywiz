// src/populate-quarters.ts
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';

// Replace this with your actual Firebase config
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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const quarters = [
  '0122', '0322', '0622', '0922', '1222',
  '0323', '0623', '0923', '1223',
  '0324', '0624', '0924', '1224',
  '0325', '0625', '0925', '1225',
  '0326', '0626', '0926'
];

async function populateQuarters() {
  for (const quarter of quarters) {
    const year = '20' + quarter.slice(2);
    const month = quarter.slice(0, 2);
    const startDate = new Date(`${year}-${month}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 3);
    endDate.setDate(0);  // Last day of the previous month

    const quarterData = {
      name: `${getQuarterName(month)} ${year}`,
      startDate,
      endDate,
      active: false,
      samples: {
        0: { mashbill: "Bourbon", proof: 100, age: 4 },
        1: { mashbill: "Rye", proof: 90, age: 3 },
        2: { mashbill: "Wheat", proof: 92, age: 5 },
        3: { mashbill: "Single Malt", proof: 86, age: 6 }
      }
    };

    await setDoc(doc(db, 'quarters', quarter), quarterData);
    console.log(`Created quarter document: ${quarter}`);
  }
}

function getQuarterName(month: string): string {
  const quarterNumber = Math.floor((parseInt(month) - 1) / 3) + 1;
  return `Q${quarterNumber}`;
}

populateQuarters().then(() => console.log('All quarters populated'));