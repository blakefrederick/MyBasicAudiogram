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
  testType?: 'standard' | 'highFrequency';
};

export const FREQUENCIES = [250, 500, 1000, 2000, 4000, 8000];
export const HIGH_FREQUENCIES = [6000, 7000, 7400, 7600, 7800, 8000, 8200, 8400, 8600, 9000, 10000];
