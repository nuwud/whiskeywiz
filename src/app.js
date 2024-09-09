const gameContainer = document.getElementById('game-container');

// Function to create a basic game UI
function createGameUI() {
    // Create Mashbill category selector
    const mashbillLabel = document.createElement('label');
    mashbillLabel.innerText = 'Select Mashbill Category: ';
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

    // Append elements to the game container
    gameContainer.appendChild(mashbillLabel);
    gameContainer.appendChild(mashbillSelect);
    gameContainer.appendChild(document.createElement('br'));
    gameContainer.appendChild(proofLabel);
    gameContainer.appendChild(proofSlider);
    gameContainer.appendChild(proofValue);
    gameContainer.appendChild(document.createElement('br'));
    gameContainer.appendChild(ageLabel);
    gameContainer.appendChild(ageSlider);
    gameContainer.appendChild(ageValue);
}

// Initialize the game UI on page load
window.onload = () => {
    createGameUI();
};
