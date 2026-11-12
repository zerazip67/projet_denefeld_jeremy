export interface Pollution {
  id: number;
  titre: string;
  type: string;
  description: string;
  date: string;
  lieu: string;
  latitude: number | null;
  longitude: number | null;
  photo: string;
}

export type PollutionInput = Omit<Pollution, 'id'>;
