import { PollutionLevelPipe } from './pollution-level.pipe';

describe('PollutionLevelPipe', () => {
  const pipe = new PollutionLevelPipe();

  it('classifies the boundaries of each pollution level', () => {
    expect(pipe.transform(0)).toBe('Faible');
    expect(pipe.transform(20)).toBe('Faible');
    expect(pipe.transform(21)).toBe('Modérée');
    expect(pipe.transform(50)).toBe('Modérée');
    expect(pipe.transform(51)).toBe('Élevée');
    expect(pipe.transform(100)).toBe('Élevée');
    expect(pipe.transform(101)).toBe('Dangereuse');
  });
});
