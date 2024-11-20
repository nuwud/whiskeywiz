(function() {
    const template = document.createElement('template');
    template.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          font-family: var(--font-family, Helvetica);
        }
      </style>
      <div id="game-root"></div>
    `;
  
    class WhiskeyWizGame extends HTMLElement {
      constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
      }
  
      static get observedAttributes() {
        return ['quarter'];
      }
  
      connectedCallback() {
        const quarter = this.getAttribute('quarter');
        // Initialize game component
        this.initializeGame(quarter);
      }
  
      initializeGame(quarter) {
        const gameRoot = this.shadowRoot.getElementById('game-root');
        // Mount Angular component
        const gameComponent = document.createElement('whiskey-wiz-game-component');
        gameComponent.setAttribute('quarter', quarter);
        gameRoot.appendChild(gameComponent);
      }
    }
  
    if (!customElements.get('whiskey-wiz-game')) {
      customElements.define('whiskey-wiz-game', WhiskeyWizGame);
    }
  })();