import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js';
import { getFirestore, collection, getDocs, doc, setDoc, deleteDoc } from 'https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js';

// Firebase configuration
const firebaseConfig = {
  // Your Firebase configuration here
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to save a quarter
async function saveQuarter(quarterData) {
  try {
    const docRef = await setDoc(doc(collection(db, 'quarters')), quarterData);
    console.log('Quarter saved successfully');
    return docRef.id;
  } catch (error) {
    console.error('Error saving quarter:', error);
    throw error;
  }
}

// Function to get all quarters
async function getQuarters() {
  const quarters = [];
  const querySnapshot = await getDocs(collection(db, 'quarters'));
  querySnapshot.forEach((doc) => {
    quarters.push({ id: doc.id, ...doc.data() });
  });
  return quarters;
}

// Function to delete a quarter
async function deleteQuarter(quarterId) {
  try {
    await deleteDoc(doc(db, 'quarters', quarterId));
    console.log('Quarter deleted successfully');
  } catch (error) {
    console.error('Error deleting quarter:', error);
    throw error;
  }
}

// Function to generate the next quarter name
function getNextQuarterName(existingQuarters) {
  const currentDate = new Date();
  let nextYear = currentDate.getFullYear();
  let nextQuarter = Math.floor(currentDate.getMonth() / 3) + 2;

  if (nextQuarter > 4) {
    nextQuarter = 1;
    nextYear++;
  }

  let proposedName = Q ;
  
  while (existingQuarters.some(q => q.name === proposedName)) {
    nextQuarter++;
    if (nextQuarter > 4) {
      nextQuarter = 1;
      nextYear++;
    }
    proposedName = Q ;
  }

  return proposedName;
}

// Export functions to be used in admin.html
window.saveQuarter = saveQuarter;
window.getQuarters = getQuarters;
window.deleteQuarter = deleteQuarter;
window.getNextQuarterName = getNextQuarterName;
