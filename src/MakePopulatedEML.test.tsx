import MakePopulatedEML from './MakePopulatedEML';
import emlTemplate from './eml-blank.xml.js';

/**
 * @jest-environment jsdom
 */

describe('getPopulatedEmlTemplate', () => {
  it('serves an empty eml file if empty form data is passed in', () => {
    const results = MakePopulatedEML({});
    expect(results.replace(/\s/g, '')).toBe(emlTemplate.replace(/\s/g, ''));
  });

  it('fills in simple fields like title and abstract', () => {
    const formData = { title: 'My title', abstract: 'My abstract'};
    const expectedTitleTag = '<title xml:lang="eng">My title</title>';
    const expectedAbstractTag = '<abstract>My abstract</abstract>';

    const results = MakePopulatedEML(formData);
    expect(results).toContain(expectedTitleTag);
    expect(results).toContain(expectedAbstractTag);
  });
})
