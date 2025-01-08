// src/app/services/hermona-font.service.ts
import { Injectable } from '@angular/core';

export type HermonaGlyphType = 
  | 'button-standard'    // Using I glyph
  | 'button-ornate'      // Using K glyph
  | 'button-nav';        // Using I glyph for navigation

@Injectable({
  providedIn: 'root'
})
export class HermonaFontService {
  private readonly glyphMap: Record<HermonaGlyphType, string> = {
    'button-standard': 'I',
    'button-ornate': 'K',
    'button-nav': 'I'
  };

  getGlyphChar(type: HermonaGlyphType): string {
    return this.glyphMap[type] || 'I';  // Default to I if type not found
  }
}