export type SampleLetter = 'A' | 'B' | 'C' | 'D';

export interface Quarter {
  id: string;
  name: string;
  active: boolean;
  samples: Record<SampleLetter, Sample>;
  startDate?: Date;
  endDate?: Date;
  videoUrl?: string;
}

export interface Sample {
  id: string;
  age: number;
  proof: number;
  mashbill: string;
  name?: string;
  distillery?: string;
}

export interface PlayerScore {
  score: number;
  timestamp: number;
  playerId?: string;
  quarterId?: string;
}