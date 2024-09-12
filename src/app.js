import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

// Your Firebase configuration object
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Initialize Firestore

const gameContainer = document.getElementById('game-container');

// Function to create a basic game UI for each sample
function createGameUI(quarterData, quarterId) {
    quarterData.samples.forEach((sample, index) => {
        // Create container for each sample
        const sampleDiv = document.createElement('div');
        sampleDiv.classList.add('sample');

        // Create Mashbill category selector
        const mashbillLabel = document.createElement('label');
        mashbillLabel.innerText = `Sample ${index + 1} - Select Mashbill: `;
        const mashbillSelect = document.createElement('select');
        const categories = ['Bourbon', 'Rye', 'Wheat', 'Single Malt', 'Blend', 'Specialty'];
        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat;
            option.innerText = cat;
            mashbillSelect.appendChild(option);
        });

        // Create proof slider
        const proofLabel = document.createElement('label');
        proofLabel.innerText = 'Guess the Proof: ';
        const proofSlider = document.createElement('input');
        proofSlider.type = 'range';
        proofSlider.min = '80';
        proofSlider.max = '130';
        proofSlider.value = '100';
        const proofValue = document.createElement('span');
        proofValue.innerText = '100';
        proofSlider.addEventListener('input', () => {
            proofValue.innerText = proofSlider.value;
        });

        // Create age slider
        const ageLabel = document.createElement('label');
        ageLabel.innerText = 'Guess the Age: ';
        const ageSlider = document.createElement('input');
        ageSlider.type = 'range';
        ageSlider.min = '1';
        ageSlider.max = '10';
        ageSlider.value = '5';
        const ageValue = document.createElement('span');
        ageValue.innerText = '5';
        ageSlider.addEventListener('input', () => {
            ageValue.innerText = ageSlider.value;
        });

        // Append elements to the sample div
        sampleDiv.appendChild(mashbillLabel);
        sampleDiv.appendChild(mashbillSelect);
        sampleDiv.appendChild(document.createElement('br'));
        sampleDiv.appendChild(proofLabel);
        sampleDiv.appendChild(proofSlider);
        sampleDiv.appendChild(proofValue);
        sampleDiv.appendChild(document.createElement('br'));
        sampleDiv.appendChild(ageLabel);
        sampleDiv.appendChild(ageSlider);
        sampleDiv.appendChild(ageValue);

        // Append the sample div to the game container
        gameContainer.appendChild(sampleDiv);
    });
}

// Function to fetch quarters from Firestore and build the UI
async function fetchAndBuildGame() {
    try {
        const quartersRef = collection(db, 'quarters');
        const quartersSnapshot = await getDocs(quartersRef);

        quartersSnapshot.forEach(doc => {
            const quarterData = doc.data();
            createGameUI(quarterData, doc.id);
        });

    } catch (error) {
        console.error('Error fetching quarters:', error);
    }
}

// Function to submit player guesses to Firestore
async function submitPlayerGuesses() {
    const playerGuesses = [];

    // Gather all the player guesses from the UI
    document.querySelectorAll('.sample').forEach((sampleDiv, index) => {
        const mashbill = sampleDiv.querySelector('select').value;
        const proof = sampleDiv.querySelector('input[type="range"]').value;
        const age = sampleDiv.querySelector('input[type="range"]').value;

        playerGuesses.push({ sample: index + 1, mashbill, proof, age });
    });

    // Save player guesses to Firestore under a 'guesses' collection
    try {
        const guessesRef = collection(db, 'guesses');
        await addDoc(guessesRef, {
            guesses: playerGuesses,
            timestamp: new Date()
        });
        alert('Your guesses have been submitted!');
    } catch (error) {
        console.error('Error submitting guesses:', error);
    }
}

// Initialize the game UI on page load
window.onload = () => {
    fetchAndBuildGame();

    // Create and append the submit button
    const submitButton = document.createElement('button');
    submitButton.innerText = 'Submit Guess';
    submitButton.onclick = submitPlayerGuesses;
    gameContainer.appendChild(submitButton);
};
