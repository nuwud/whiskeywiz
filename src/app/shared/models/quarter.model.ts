export type SampleLetter = 'A' | 'B' | 'C' | 'D';
export type MashbillType = 'Bourbon' | 'Rye' | 'Wheat' | 'Single Malt' | 'Blend' | 'Specialty';

export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  variantId?: string;
  price?: string;
  available?: boolean;
}

export interface Sample {
  id: string;
  age: number;
  proof: number;
  mashbill: MashbillType;
  name?: string;
  distillery?: string;
  shopifyProduct?: ShopifyProduct;
  revealed?: boolean;
}

export interface Quarter {
  id: string;
  name: string;
  active: boolean;
  samples: {
    sample1: Sample;
    sample2: Sample;
    sample3: Sample;
    sample4: Sample;
  };
  startDate?: Date;
  endDate?: Date;
  videoUrl?: string;
  revealDate?: Date;
  completedBy?: string[];
}

export interface QuarterWithLetters extends Omit<Quarter, 'samples'> {
  samples: Record<SampleLetter, Sample>;
}

export interface PlayerScore {
  score: number;
  timestamp: number;
  playerId?: string;
  quarterId?: string;
  guesses?: Record<SampleLetter, Sample>;
}