// src/app/services/hermona-font.service.ts
import { Injectable } from '@angular/core';

export type HermonaGlyphType = 
  | 'panel-gradient'
  | 'panel-dark'
  | 'panel-center'
  | 'button-plain'
  | 'button-rounded'
  | 'button-fancy'
  | 'divider-left'
  | 'divider-right'
  | 'scroll-left'
  | 'scroll-right'
  | 'swirl-left'
  | 'swirl-right'
  | 'corner-top-left'
  | 'corner-top-right'
  | 'corner-bottom-left'
  | 'corner-bottom-right'
  | 'button-submit'
  | 'button-share'
  | 'button-play';

@Injectable({
  providedIn: 'root'
})
export class HermonaFontService {
  private readonly glyphMap: Record<string, string> = {
    // Row 1: Panels and Basic Shapes
    'A': '1',  // gradient panel
    'B': '2',  // dark panel
    'C': '3',  // light panel
    'D': '4',  // plain button
    'E': '5',  // rounded button
    'F': '6',  // fancy button
    
    // Row 2: Dividers and Scrolls
    'G': '7',  // left divider
    'H': '8',  // right divider
    'I': '9',  // left scroll
    'J': '0',  // right scroll
    
    // Row 3: Decorative Elements
    'K': '@',  // left swirl
    'L': '#',  // right swirl
    'M': '$',  // top left corner
    'N': '%',  // top right corner
    'O': '^',  // bottom left corner
    'P': '&',  // bottom right corner
    
    // Special Buttons
    'Q': '*',  // submit button
    'R': '(',  // share button
    'S': ')'   // play button
  };

  getGlyphChar(type: HermonaGlyphType): string {
    const entry = Object.entries(this.glyphMap).find(([_, value]) => value === type);
    return entry ? entry[0] : '';
  }

  getAllGlyphs(): Array<{ type: HermonaGlyphType; char: string }> {
    return Object.entries(this.glyphMap).map(([char, type]) => ({
      type: type as HermonaGlyphType,
      char
    }));
  }
}
