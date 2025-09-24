import MakePopulatedEML from './MakePopulatedEML';

/**
 * @jest-environment jsdom
 */

const parse = (xml: string): Document => new DOMParser().parseFromString(xml, 'application/xml');

const nodeText = (node: Element | null, selector: string): string | null => {
  if (!node) {
    return null;
  }

  const match = node.querySelector(selector);
  return match ? match.textContent : null;
};

const countNodes = (doc: Document, selector: string): number => doc.querySelectorAll(selector).length;

const hasSelfClosingTags = (xml: string): boolean => /<[^?>!][^>]*\/\s*>/.test(xml);

describe('MakePopulatedEML', () => {
  it('creates a minimal but valid EML document without empty tags', () => {
    const xml = MakePopulatedEML({});
    const doc = parse(xml);

    expect(xml.startsWith('<eml:eml')).toBe(true);
    expect(hasSelfClosingTags(xml)).toBe(false);
    expect(doc.querySelector('dataset')).not.toBeNull();
    expect(countNodes(doc, 'dataset > alternateIdentifier')).toBe(0);
    expect(countNodes(doc, 'dataset > creator')).toBe(0);
    expect(countNodes(doc, 'dataset > contact')).toBe(0);
    expect(nodeText(doc.documentElement, 'dataset > metadataLanguage')).toBe('eng');
    expect(nodeText(doc.documentElement, 'dataset > language')).toBe('eng');
    expect(nodeText(doc.documentElement, 'additionalMetadata hierarchyLevel')).toBe('dataset');
  });

  it('populates simple textual fields', () => {
    const xml = MakePopulatedEML({ title: 'Dataset title', abstract: 'First paragraph\nSecond paragraph' });
    const doc = parse(xml);

    const title = doc.querySelector('dataset > title');
    expect(title?.getAttribute('xml:lang')).toBe('eng');
    expect(title?.textContent).toBe('Dataset title');

    const abstract = doc.querySelectorAll('dataset > abstract > para');
    expect(abstract.length).toBe(2);
    expect(Array.from(abstract).map((node) => node.textContent)).toEqual(['First paragraph', 'Second paragraph']);
  });

  it('builds party lists and omits missing child elements', () => {
    const xml = MakePopulatedEML({
      resourceContact: [
        {
          givenName: 'Grant',
          surName: 'Fitzsimmons',
          organizationName: 'KU',
          country: 'UNITED STATES',
          electronicMailAddress: 'grant@example.org',
          userId: '0000-0000',
          deliveryPoint: 'Main St',
          postalCode: '12345'
        },
        {
          givenName: 'OnlyGivenName'
        }
      ]
    });

    const doc = parse(xml);
    expect(countNodes(doc, 'dataset > creator')).toBe(2);
    expect(countNodes(doc, 'dataset > metadataProvider')).toBe(2);
    const contacts = Array.from(doc.querySelectorAll('dataset > contact'));
    expect(contacts.length).toBe(2);

    const first = contacts[0];
    expect(nodeText(first, 'individualName > givenName')).toBe('Grant');
    expect(nodeText(first, 'individualName > surName')).toBe('Fitzsimmons');
    expect(nodeText(first, 'address > country')).toBe('US');
    expect(nodeText(first, 'userId')).toBe('0000-0000');
    expect(first.querySelector('surName:empty')).toBeNull();

    const second = contacts[1];
    expect(nodeText(second, 'individualName > givenName')).toBe('OnlyGivenName');
    expect(second.querySelector('individualName > surName')).toBeNull();
  });

  it('retains legacy party arrays when resource contacts are absent', () => {
    const xml = MakePopulatedEML({
      creator: [{ givenName: 'LegacyCreator' }],
      contact: [{ givenName: 'LegacyContact' }],
      metadataProvider: [{ givenName: 'LegacyMetadata' }]
    });

    const doc = parse(xml);
    expect(nodeText(doc.querySelector('dataset > creator'), 'individualName > givenName')).toBe('LegacyCreator');
    expect(nodeText(doc.querySelector('dataset > contact'), 'individualName > givenName')).toBe('LegacyContact');
    expect(nodeText(doc.querySelector('dataset > metadataProvider'), 'individualName > givenName')).toBe('LegacyMetadata');
  });

  it('normalises urls for distributions and contacts', () => {
    const xml = MakePopulatedEML({
      online: { url: 'example.org/info' },
      resourceContact: [{ onlineUrl: 'contact.org' }],
      physical: [{ url: 'download.example.com/file.csv' }],
      additionalMetadata: { resourceLogoUrl: 'logo.example.com/img.png' }
    });

    const doc = parse(xml);
    expect(doc.querySelector('dataset > distribution url')?.textContent).toBe('http://example.org/info');
    expect(nodeText(doc.querySelector('dataset > contact'), 'onlineUrl')).toBe('http://contact.org/');
    expect(doc.querySelector('gbif > physical > distribution url')?.textContent).toBe('http://download.example.com/file.csv');
    expect(nodeText(doc.querySelector('gbif'), 'resourceLogoUrl')).toBe('http://logo.example.com/img.png');
  });

  it('adds coverage elements only when data is present', () => {
    const xml = MakePopulatedEML({
      geographicCoverage: {
        westBoundingCoordinate: '4',
        eastBoundingCoordinate: '11.1'
      },
      singleDateTime: { calendarDate: '2021-01-01' },
      rangeOfDates: {
        beginDate: { calendarDate: '2021-01-02' },
        endDate: { calendarDate: '2021-01-03' }
      },
      taxonomicCoverage: {
        generalTaxonomicCoverage: 'General',
        taxonomicClassification: [
          { taxonRankName: 'species', taxonRankValue: 'Homo sapiens' }
        ]
      }
    });

    const doc = parse(xml);
    const coverage = doc.querySelector('dataset > coverage');
    expect(coverage).not.toBeNull();
    expect(countNodes(doc, 'geographicCoverage boundingCoordinates > westBoundingCoordinate')).toBe(1);
    expect(countNodes(doc, 'geographicCoverage boundingCoordinates > northBoundingCoordinate')).toBe(0);
    expect(nodeText(coverage!, 'taxonomicCoverage > generalTaxonomicCoverage')).toBe('General');
    expect(nodeText(coverage!, 'temporalCoverage > singleDateTime > calendarDate')).toBe('2021-01-01');
    expect(nodeText(coverage!, 'temporalCoverage > rangeOfDates > beginDate > calendarDate')).toBe('2021-01-02');
  });

  it('creates methods and project sections with paragraphs', () => {
    const xml = MakePopulatedEML({
      methodStep: [
        { description: 'Collect samples' },
        { description: 'Process data' }
      ],
      studyExtent: 'Study extent text',
      qualityControl: 'QC text',
      samplingDescription: 'Sampling desc',
      project: {
        title: 'Project title',
        abstract: 'Project abstract',
        funding: 'Funding info',
        studyAreaDescription: 'Study area',
        designDescription: 'Design description'
      }
    });

    const doc = parse(xml);
    expect(countNodes(doc, 'dataset > methods > methodStep')).toBe(2);
    expect(nodeText(doc.querySelector('methods > sampling'), 'studyExtent > description > para')).toBe('Study extent text');
    expect(nodeText(doc.querySelector('methods > qualityControl'), 'description > para')).toBe('QC text');
    expect(nodeText(doc.querySelector('project'), 'funding > para')).toBe('Funding info');
  });

  it('adds GBIF metadata information with attributes', () => {
    const xml = MakePopulatedEML({
      bibliography: [
        { citation: 'Reference one', citation__identifier: 'id1' }
      ],
      physical: [
        { objectName: 'Zenodo', url: 'https://zenodo.org', formatName: 'csv' }
      ],
      collection: [
        {
          parentCollectionIdentifier: 'KUBI',
          collectionIdentifier: 'KUBI-INFO',
          collectionName: 'KU Informatics'
        }
      ],
      specimenPreservationMethod: ['alcohol'],
      jgtiCuratorialUnit: [
        { jgtiUnitType: 'countrange', beginRange: '10', endRange: '20' }
      ],
      additionalMetadata: {
        citation: 'Dataset citation',
        citation__identifier: 'doi:1234',
        dateStamp: '2021-01-01T00:00:00Z',
        resourceLogoUrl: 'https://example.org/logo.png'
      }
    });

    const doc = parse(xml);
    const gbif = doc.querySelector('additionalMetadata > metadata > gbif');

    expect(gbif).not.toBeNull();
    expect(nodeText(gbif!, 'dateStamp')).toBe('2021-01-01T00:00:00Z');
    expect(nodeText(gbif!, 'citation')).toBe('Dataset citation');
    expect(gbif?.querySelector('citation')?.getAttribute('identifier')).toBe('doi:1234');
    expect(countNodes(doc, 'gbif > citation')).toBe(1);
    expect(countNodes(doc, 'gbif > bibliography > citation')).toBe(1);
    expect(countNodes(doc, 'gbif > physical')).toBe(1);
    expect(countNodes(doc, 'gbif > collection')).toBe(1);
    expect(countNodes(doc, 'gbif > specimenPreservationMethod')).toBe(1);
    expect(countNodes(doc, 'gbif > jgtiCuratorialUnit')).toBe(1);
  });

  it('ignores empty keyword entries', () => {
    const xml = MakePopulatedEML({ keywordSet: [{}, { keyword: 'plant' }] });
    const doc = parse(xml);

    expect(countNodes(doc, 'dataset > keywordSet')).toBe(1);
    expect(nodeText(doc.querySelector('keywordSet'), 'keyword')).toBe('plant');
  });
});
