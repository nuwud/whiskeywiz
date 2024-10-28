export interface Sample {
  age: number;
  proof: number;
  mashbill: string;
}
export interface Quarter {
    id?: string;
    name: string;
    active: boolean;
    samples: {
      [key: string]: {
        mashbill: string;
        proof: number;
        age: number;
      }
    };
  }
  
  export interface PlayerScore {
    playerId: string;
    playerName: string;
    score: number;
    quarterId: string;
  }