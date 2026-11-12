import { HighlightPollutionDirective } from './highlight-pollution.directive';

describe('HighlightPollutionDirective', () => {
  it('chooses the expected background color for each level', () => {
    const directive = new HighlightPollutionDirective();

    directive.appHighlightPollution = 20;
    expect(directive.backgroundColor).toBe('#c8e6c9');

    directive.appHighlightPollution = 21;
    expect(directive.backgroundColor).toBe('#fff176');

    directive.appHighlightPollution = 51;
    expect(directive.backgroundColor).toBe('#ffb74d');

    directive.appHighlightPollution = 101;
    expect(directive.backgroundColor).toBe('#ef9a9a');
  });
});
