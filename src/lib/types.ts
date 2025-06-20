export type Ear = 'left' | 'right';

export type ToneResult = {
  frequency: number;
  ear: Ear;
  gainLevel: number; // 0-100 or dB value
};

export type HearingTestSession = {
  id: string;
  timestamp: string;
  headphone: string;
  data: ToneResult[];
};

export const FREQUENCIES = [250, 500, 1000, 2000, 4000, 8000];
