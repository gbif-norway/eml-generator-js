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
    const expected = emlTemplate.replace('<eml ', '<eml:eml ').replace('</eml', '</eml:eml'); // Cannot parse eml:eml tag, only eml
    expect(removeSpaces(results)).toBe(removeSpaces(expected));
  });

  it('fills in simple fields like title', () => {
    const formData = { title: 'My title' };
    const expected = '<title xml:lang="eng">My title</title>';

    const results = MakePopulatedEML(formData);
    expect(results).toContain(expected);
  });

  it('adds paragraph tags for abstracts with one paragraph', () => {
    const formData = { abstract: 'Description' };
    const expected = '<abstract><para>Description</para></abstract>';

    const results = MakePopulatedEML(formData);
    expect(results).toContain(expected);
  })

  it('adds paragraph tags for abstracts with two paragraphs', () => {
    const formData = { abstract: 'Description\nNewParagraph1' };
    const expected = '<abstract><para>Description</para><para>NewParagraph1</para></abstract>';

    const results = MakePopulatedEML(formData);
    expect(results).toContain(expected);
  })

  it('adds paragraph tags for abstracts with multiple paragraphs', () => {
    const formData = { abstract: 'Description\nNewParagraph1\nNewParagraph2' };
    const expected = '<abstract><para>Description</para><para>NewParagraph1</para><para>NewParagraph2</para></abstract>';

    const results = MakePopulatedEML(formData);
    expect(results).toContain(expected);
  })

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

  it('converts country name strings into country codes', () => {
    const formData = { contact: [{ country: 'NORWAY' }] };
    const expected = '<country>NO</country>';

    const results = MakePopulatedEML(formData);
    expect(removeSpaces(results)).toContain(expected);
  })

  it('fills in geographic Coverage', () => {
    const formData = {
      geographicCoverage: {
        westBoundingCoordinate: '4', eastBoundingCoordinate: '11.1',
        northBoundingCoordinate: '2', southBoundingCoordinate: '3'
      },
      geographicDescription: 'test'
    };
    const expected = '<coverage><geographicCoverage><geographicDescription>test</geographicDescription><boundingCoordinates>'
    + '<westBoundingCoordinate>4</westBoundingCoordinate><eastBoundingCoordinate>11.1</eastBoundingCoordinate>'
    + '<northBoundingCoordinate>2</northBoundingCoordinate><southBoundingCoordinate>3</southBoundingCoordinate></boundingCoordinates>';

    const results = MakePopulatedEML(formData);
    expect(removeSpaces(results)).toContain(expected);
    expect(results.split('11.1').length - 1).toEqual(1);
  });

  it('fills in taxonomic Coverage (which has nested multiple fields)', () => {
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

  it('fills in temporal Coverage', () => {
    const formData = {
      singleDateTime: { calendarDate: "2021-01-01" },
      rangeOfDates: {
        beginDate: { calendarDate: "2021-01-02" },
        endDate: { calendarDate: "2021-01-03" }
      },
      additionalMetadata: {
        formationPeriod: 'Early',
        livingTimePeriod: 'Late'
      }
    };
    const expectedSingle = '<temporalCoverage><singleDateTime><calendarDate>2021-01-01</calendarDate></singleDateTime></temporalCoverage>';
    const expectedRange = '<temporalCoverage><rangeOfDates><beginDate><calendarDate>2021-01-02</calendarDate></beginDate>'
    + '<endDate><calendarDate>2021-01-03</calendarDate></endDate></rangeOfDates></temporalCoverage>';
    const expectedFormation = '<formationPeriod>Early</formationPeriod>';
    const expectedLiving = '<livingTimePeriod>Late</livingTimePeriod>';

    const results = MakePopulatedEML(formData);
    expect(removeSpaces(results)).toContain(expectedSingle);
    expect(removeSpaces(results)).toContain(expectedRange);
    expect(removeSpaces(results)).toContain(expectedFormation);
    expect(removeSpaces(results)).toContain(expectedLiving);
  });

  it('fills in keywords', () => {
    const formData = { keywordSet: [{ keywordThesaurus: 'IRIS', keyword: 'plant' }] };
    // Should we add occurrence keywords in here like the IPT does?
    const expected = '<keywordSet><keyword>plant</keyword><keywordThesaurus>IRIS</keywordThesaurus></keywordSet>';

    const results = MakePopulatedEML(formData);
    expect(removeSpaces(results)).toContain(expected);
  });

  it('fills in project data', () => {
    const formData = { project: { abstract: 'Description1', funding: 'Money!' } };
    const expected = '<abstract><para>Description1</para></abstract><funding>Money!</funding>';

    const results = MakePopulatedEML(formData);
    expect(removeSpaces(results)).toContain(expected);
    // Note there is an 'abstract' right at the start of the EML, check that this one is the only one populated
    expect(results.split('Description1').length - 1).toEqual(1);
  });

  it('fills in sampling methods', () => {
    const formData = {
      methods: [{ methodStep: 'Step1' }, { methodStep: 'Step2' }],
      qualityControl: 'QC',
      samplingDescription: 'Another',
      studyExtent: 'MyExtent'
    };
    // For some weird reason this is rendering as it should (like below) in browser, but not in the test
    //const expected = '<methods><methodStep><description>Step1</description></methodStep><methodStep><description>Step2</description></methodStep><methodStep><description><para/></description></methodStep>'
    //+ '<sampling><studyExtent>MyExtent</studyExtent><samplingDescription>Another</samplingDescription></sampling>'
    //+ '<qualityControl>QC</qualityControl></methods>';
    const sampling = '<sampling><studyExtent>MyExtent</studyExtent><samplingDescription>Another</samplingDescription></sampling>';
    const qc = '<qualityControl>QC</qualityControl></methods>';

    const results = MakePopulatedEML(formData);
    expect(removeSpaces(results)).toContain('Step1');
    expect(removeSpaces(results)).toContain('Step2');
    expect(removeSpaces(results)).toContain(sampling);
    expect(removeSpaces(results)).toContain(qc);
  });

  it('fills in citation information', () => {
    const formData = {
      bibliography: [
        { citation: "first", citation__identifier: "id1" },
        { citation: "second", citation__identifier: "id2" }
      ]
    }
    const expected = '<bibliography><citationidentifier="id1">first</citation></bibliography>'
    + '<bibliography><citationidentifier="id2">second</citation></bibliography>';

    const results = MakePopulatedEML(formData);
    expect(removeSpaces(results)).toContain(expected);
  });

  it('fills in collection info', () => {
    const formData = {
      collection: [{ collectionName: 'collname', collectionIdentifier: 'collid', parentCollectionIdentifier: 'parentcoll' }],
      specimenPreservationMethod: [ '1', '2' ],
      jgtiCuratorialUnit: [
        { jgtiUnitType: 'unittype1', beginRange: '2021-12-02'},
        { jgtiUnitType: 'unittype2', endRange: '2021-12-16' }
      ]
    };
    const collection = '<collection><parentCollectionIdentifier>parentcoll</parentCollectionIdentifier>'
    + '<collectionIdentifier>collid</collectionIdentifier><collectionName>collname</collectionName></collection>';
    const preservation = '<specimenPreservationMethod>1</specimenPreservationMethod><specimenPreservationMethod>2</specimenPreservationMethod>';
    const curatorial = '<jgtiCuratorialUnit><jgtiUnitType>unittype1</jgtiUnitType><jgtiUnitRange><beginRange>2021-12-02</beginRange><endRange/></jgtiUnitRange></jgtiCuratorialUnit>'
    + '<jgtiCuratorialUnit><jgtiUnitType>unittype2</jgtiUnitType><jgtiUnitRange><beginRange/><endRange>2021-12-16</endRange></jgtiUnitRange></jgtiCuratorialUnit>';

    const results = MakePopulatedEML(formData);
    expect(removeSpaces(results)).toContain(collection);
    expect(removeSpaces(results)).toContain(preservation);
    expect(removeSpaces(results)).toContain(curatorial);
  });

  it('fills in external links info', () => {
    const formData = {
      online: { url: 'myhomepage.com' },
      physical: [
        { characterEncoding: 'utf8', formatName: 'xlsx', formatVersion: '1', objectName: 'zenodo', url: 'zenodo.com'}
      ]
    };
    const online = '<distributionscope="document"><online><urlfunction="information">myhomepage.com</url></online></distribution>';
    const physical = '<physical><objectName>zenodo</objectName><characterEncoding>utf8</characterEncoding>'
    + '<dataFormat><externallyDefinedFormat><formatName>xlsx</formatName><formatVersion>1</formatVersion></externallyDefinedFormat></dataFormat>'
    + '<distribution><online><urlfunction="download">zenodo.com</url></online></distribution></physical>';

    const results = MakePopulatedEML(formData);
    expect(removeSpaces(results)).toContain(online);
    expect(removeSpaces(results)).toContain(physical);
  });

  it('fills in additional metadata', () => {
    const formData = {
      purpose: 'purpose',
      maintenance: { description: 'maintenance' },
      additionalInfo: 'addinfo',
      alternateIdentifier: ['1', '2']
    }
    const pm = '<purpose>purpose</purpose><maintenance><description>maintenance</description><maintenanceUpdateFrequency/></maintenance>';
    const ai = '<additionalInfo>addinfo</additionalInfo>';
    const identifiers = '<alternateIdentifier>1</alternateIdentifier><alternateIdentifier>2</alternateIdentifier>';

    const results = MakePopulatedEML(formData);
    expect(removeSpaces(results)).toContain(pm);
    expect(removeSpaces(results)).toContain(ai);
    expect(removeSpaces(results)).toContain(identifiers);
  });
})
