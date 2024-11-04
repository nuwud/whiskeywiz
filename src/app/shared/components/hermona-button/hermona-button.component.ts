
// src/app/shared/components/hermona-button/hermona-button.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { HermonaFontService, HermonaGlyphType } from '../../../services/hermona-font.service';

@Component({
  selector: 'app-hermona-button',
  templateUrl: './hermona-button.component.html',
  styleUrls: ['./hermona-button.component.scss']
})
export class HermonaButtonComponent {
  @Input() type: 'submit' | 'share' | 'play' | 'next' | 'previous' = 'submit';
  @Input() text: string = '';
  @Input() disabled: boolean = false;
  @Input() animate: boolean = true;
  @Output() click = new EventEmitter<void>();

  constructor(private hermonaFont: HermonaFontService) {}

  get glyphChar(): string {
    let glyphType: HermonaGlyphType;
    
    switch (this.type) {
      case 'submit':
        glyphType = 'button-submit';
        break;
      case 'share':
        glyphType = 'button-share';
        break;
      case 'play':
        glyphType = 'button-play';
        break;
      case 'next':
        glyphType = 'nav-next';
        break;
      case 'previous':
        glyphType = 'nav-previous';
        break;
      default:
        glyphType = 'panel-frame';
    }
    
    return this.hermonaFont.getGlyphChar(glyphType);
  }

  onClick(): void {
    if (!this.disabled) {
      this.click.emit();
    }
  }
}