import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {
  private quarterData: any;

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit() {
    const quarterSelect = document.getElementById('quarter-select') as HTMLSelectElement;
    const gameContainer = document.getElementById('game-container') as HTMLDivElement;
    const resultsContainer = document.getElementById('results') as HTMLDivElement;
    const resultContainer = document.getElementById('result-container') as HTMLDivElement;

    // Fetch all quarters and populate the dropdown
    this.firebaseService.getCollection('quarters').subscribe((quarters: any[]) => {
      quarters.forEach((quarter) => {
        const option = document.createElement('option');
        option.value = quarter.id;
        option.text = quarter.name;
        quarterSelect.appendChild(option);
      });
    });

    quarterSelect.addEventListener('change', () => {
      const quarterId = quarterSelect.value;
      if (quarterId) {
        this.firebaseService.getDocument('quarters', quarterId).subscribe((docSnap: any) => {
          if (docSnap && docSnap.exists) { // Use type assertion to tell TypeScript that docSnap is of a specific type
            this.quarterData = docSnap.data();
            gameContainer.innerHTML = ''; // Clear previous samples

            this.quarterData.samples.forEach((sample: any, index: number) => {
              gameContainer.appendChild(this.createSampleInput(sample, index));
            });

            document.querySelectorAll('input[type="range"]').forEach(slider => {
              const valueDisplay = slider.nextElementSibling as HTMLSpanElement;
              slider.addEventListener('input', () => {
                valueDisplay.innerText = (slider as HTMLInputElement).value;
              });
            });
          } else {
            console.log('No such document!');
          }
        });
      } else {
        gameContainer.innerHTML = ''; // Clear samples if no quarter is selected
      }
    });

    document.getElementById('submit-answers')?.addEventListener('click', () => {
      resultsContainer.innerHTML = '';
      let totalScore = 0;

      document.querySelectorAll('.sample').forEach((sampleDiv, index) => {
        const mashbill = (sampleDiv.querySelector('select') as HTMLSelectElement).value;
        const proof = (sampleDiv.querySelector('input[type="range"]') as HTMLInputElement).value;
        const age = (sampleDiv.querySelector('input[type="range"]') as HTMLInputElement).value;

        const actualSample = this.quarterData.samples[index];
        let score = 0;

        if (mashbill === actualSample.mashbill) score += 10;
        score += 10 - Math.abs(parseInt(proof) - actualSample.proof);
        score += 10 - Math.abs(parseInt(age) - actualSample.age);

        totalScore += score;

        const resultDiv = document.createElement('div');
        resultDiv.innerText = `Sample ${index + 1}: ${score} points`;
        resultsContainer.appendChild(resultDiv);
      });

      const totalScoreDiv = document.createElement('div');
      totalScoreDiv.innerText = `Total Score: ${totalScore} points`;
      resultsContainer.appendChild(totalScoreDiv);

      resultContainer.style.display = 'block';
    });
  }

  private createSampleInput(sample: any, sampleIndex: number): HTMLDivElement {
    const sampleDiv = document.createElement('div');
    sampleDiv.classList.add('sample');

    const mashbillLabel = document.createElement('label');
    mashbillLabel.innerText = `Sample ${sampleIndex + 1} - Select Mashbill: `;
    const mashbillSelect = document.createElement('select');
    ['Bourbon', 'Rye', 'Wheat', 'Single Malt', 'Blend', 'Specialty'].forEach(cat => {
      const option = document.createElement('option');
      option.value = cat;
      option.innerText = cat;
      mashbillSelect.appendChild(option);
    });

    const proofLabel = document.createElement('label');
    proofLabel.innerText = 'Guess Proof: ';
    const proofSlider = document.createElement('input');
    proofSlider.type = 'range';
    proofSlider.min = '80';
    proofSlider.max = '130';
    const proofValue = document.createElement('span');
    proofSlider.addEventListener('input', () => proofValue.innerText = proofSlider.value);

    const ageLabel = document.createElement('label');
    ageLabel.innerText = 'Guess Age: ';
    const ageSlider = document.createElement('input');
    ageSlider.type = 'range';
    ageSlider.min = '1';
    ageSlider.max = '10';
    const ageValue = document.createElement('span');
    ageSlider.addEventListener('input', () => ageValue.innerText = ageSlider.value);

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

    return sampleDiv;
  }
}