export interface Sample {
  age: number;
  proof: number;
  mashbill: string;
}

export interface Quarter {
  id: string;
  name: string;
  active: boolean;
  videoUrl?: string;
  samples: {
    [key: string]: Sample;
  };
}
