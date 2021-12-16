import MakePopulatedEML from './MakePopulatedEML';
import emlTemplate from './eml-blank.xml.js';

/**
 * @jest-environment jsdom
 */
 const removeSpaces = (xmlString) => {
   return xmlString.replace(/\s/g, '');
 }

describe('getPopulatedEmlTemplate', () => {
  it('serves an empty eml file if empty form data is passed in', () => {
    const results = MakePopulatedEML({});
    expect(removeSpaces(results)).toBe(removeSpaces(emlTemplate));
  });

  it('fills in simple fields like title and abstract', () => {
    const formData = { title: 'My title', abstract: 'My abstract'};
    const expectedTitleTag = '<title xml:lang="eng">My title</title>';
    const expectedAbstractTag = '<abstract>My abstract</abstract>';

    const results = MakePopulatedEML(formData);
    expect(results).toContain(expectedTitleTag);
    expect(results).toContain(expectedAbstractTag);
  });

  it('fills in potential multiple fields like resourceContact', () => {
    const formData = {
      contact: [
        {
          givenName: 'firstname_1',
          surName: 'surname_1',
          electronicMailAddress: 'email1@email.com',
          positionName: 'position_1',
          organizationName: 'org_1'
        },
        {
          givenName: 'firstname_2',
          organizationName: 'org_2'
        }
      ]
    };
    const expectedFirstPerson = '<contact><individualName><givenName>firstname_1</givenName><surName>surname_1</surName></individualName><organizationName>org_1</organizationName><positionName>position_1</positionName>';
    const expectedSecondPerson = '<contact><individualName><givenName>firstname_2</givenName><surName/></individualName><organizationName>org_2</organizationName><positionName/>';

    const results = MakePopulatedEML(formData);
    expect(removeSpaces(results)).toContain(expectedFirstPerson);
    expect(removeSpaces(results)).toContain(expectedSecondPerson);
    expect(results.split('<contact>').length - 1).toEqual(2);
    expect(results.split('firstname_1').length - 1).toEqual(1);
  });

  it('fills in associatedParty and metadataProvider', () => {
    const formData = { associatedParty: [{ givenName: 'firstname_AP' }], metadataProvider: [{ givenName: 'firstname_MP' }] };
    const expectedAP = '<associatedParty><individualName><givenName>firstname_AP</givenName>';
    const expectedMP = '<metadataProvider><individualName><givenName>firstname_MP</givenName>';

    const results = MakePopulatedEML(formData);
    expect(removeSpaces(results)).toContain(expectedAP);
    expect(removeSpaces(results)).toContain(expectedMP);
    expect(results.split('firstname_AP').length - 1).toEqual(1);
    expect(results.split('firstname_MP').length - 1).toEqual(1);
  });

  it('fills in geographic Coverage', () => {
    const formData = {
      coverage: {
        geographicCoverage: {
          westBoundingCoordinate: '4',
          eastBoundingCoordinate: '11.1',
          northBoundingCoordinate: '2',
          southBoundingCoordinate: '3'
        }
      }
    };
    const expected = '<coverage><geographicCoverage><geographicDescription/><boundingCoordinates>'
    + '<westBoundingCoordinate>4</westBoundingCoordinate><eastBoundingCoordinate>11.1</eastBoundingCoordinate>'
    + '<northBoundingCoordinate>2</northBoundingCoordinate><southBoundingCoordinate>3</southBoundingCoordinate></boundingCoordinates>';

    const results = MakePopulatedEML(formData);
    expect(removeSpaces(results)).toContain(expected);
    expect(results.split('11.1').length - 1).toEqual(1);
  });

  it('fills in taxonomic Coverage', () => {
    const formData = { generalTaxonomicCoverage: 'General', taxonomicClassification: [
      { taxonRankName: 'Superphylum', taxonRankValue: 'Patescibacteria', commonName: 'Common_1' },
      { taxonRankName: 'Genus', taxonRankValue: 'Eudyptes', commonName: 'Penguin' }
    ]};
    const expected = '<taxonomicCoverage><generalTaxonomicCoverage>General</generalTaxonomicCoverage>'
    + '<taxonomicClassification><taxonRankName>Superphylum</taxonRankName><taxonRankValue>Patescibacteria</taxonRankValue><commonName>Common_1</commonName></taxonomicClassification>'
    + '<taxonomicClassification><taxonRankName>Genus</taxonRankName><taxonRankValue>Eudyptes</taxonRankValue><commonName>Penguin</commonName></taxonomicClassification>'
    + '</taxonomicCoverage>';

    const results = MakePopulatedEML(formData);
    expect(removeSpaces(results)).toContain(expected);
    expect(results.split('Eudyptes').length - 1).toEqual(1);
  });
})
