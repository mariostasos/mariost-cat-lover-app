export interface CatEntity {
  id: string;
  url: string;
  width: number;
  height: number;
  breeds?: Breed[];
}

export interface Breed {
  id: string;
  name: string;
  description: string;
  origin: string;
  life_span: string;
  temperament: string;
  weight: {
    imperial: string;
    metric: string;
  };
  wikipedia_url?: string;
  hypoallergenic: number;
  adaptability: number;
  affection_level: number;
  child_friendly: number;
  dog_friendly: number;
  energy_level: number;
  grooming: number;
  health_issues: number;
  intelligence: number;
  shedding_level: number;
  social_needs: number;
  stranger_friendly: number;
  vocalisation: number;
}
