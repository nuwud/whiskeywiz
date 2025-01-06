import { createCustomElement } from '@angular/elements';
import { NgModule, Injector } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { GameComponent } from '../shared/game/game.component';

const styles = `
  :host {
    display: block;
    width: 100%;
    height: 100%;
    --ww-primary: #FFD700;
    --ww-background: #1A1A1A;
    --ww-text: #FFFFFF;
  }

  .whiskey-wiz-container {
    background: var(--ww-background);
    color: var(--ww-text);
    font-family: Helvetica, Arial, sans-serif;
    padding: 20px;
    border-radius: 8px;
    margin: 20px 0;
  }

  .ww-button {
    background: var(--ww-primary);
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
  }

  @media (max-width: 768px) {
    .whiskey-wiz-container {
      padding: 10px;
    }
  }
`;

@NgModule({
  imports: [BrowserModule],
  declarations: [GameComponent],
  entryComponents: [GameComponent]
})
export class GameElementModule {
  constructor(private injector: Injector) {
    const WhiskeyWizElement = createCustomElement(GameComponent, {
      injector: this.injector
    });

    if (!customElements.get('whiskey-wiz-game')) {
      customElements.define('whiskey-wiz-game', WhiskeyWizElement);
    }
  }

  ngDoBootstrap() {}
}

export class WhiskeyWizElement extends HTMLElement {
  private shadow: ShadowRoot;
  private gameInstance: any;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    this.shadow.appendChild(styleSheet);
    
    const container = document.createElement('div');
    container.className = 'whiskey-wiz-container';
    this.shadow.appendChild(container);
  }

  static get observedAttributes() {
    return ['quarter-id'];
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (name === 'quarter-id' && oldValue !== newValue) {
      this.initializeGame(newValue);
    }
  }

  private async initializeGame(quarterId: string) {
    try {
      if (this.gameInstance) {
        this.gameInstance.cleanup();
      }

      const container = this.shadow.querySelector('.whiskey-wiz-container');
      if (container) {
        container.innerHTML = '';
        
        this.gameInstance = document.createElement('whiskey-wiz-game');
        this.gameInstance.setAttribute('quarter-id', quarterId);
        container.appendChild(this.gameInstance);
      }
    } catch (error) {
      console.error('Error initializing WhiskeyWiz game:', error);
      this.handleError(error);
    }
  }

  private handleError(error: any) {
    const container = this.shadow.querySelector('.whiskey-wiz-container');
    if (container) {
      container.innerHTML = `
        <div class="error-message">
          <p>Unable to load WhiskeyWiz game. Please try refreshing the page.</p>
          <button class="ww-button" onclick="location.reload()">Refresh</button>
        </div>
      `;
    }
  }

  disconnectedCallback() {
    if (this.gameInstance) {
      this.gameInstance.cleanup();
    }
  }

  connectedCallback() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const quarterId = this.getAttribute('quarter-id');
            if (quarterId) {
              this.initializeGame(quarterId);
            }
          }
        });
      },
      { threshold: 0.1 }
    );
    
    observer.observe(this);
  }
}