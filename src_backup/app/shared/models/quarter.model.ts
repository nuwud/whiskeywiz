export interface Quarter {
    id?: string;
    name: string;
    startDate: Date;
    endDate: Date;
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