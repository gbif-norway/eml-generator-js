import countries from './countries.js';

export type JsonRecord = Record<string, unknown>;

const EML_NS = 'eml://ecoinformatics.org/eml-2.1.1';
const XML_NS = 'http://www.w3.org/XML/1998/namespace';
const XSI_NS = 'http://www.w3.org/2001/XMLSchema-instance';
const DEFAULT_LANGUAGE = 'eng';
const DEFAULT_TITLE = 'Untitled dataset';
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const defaultDateStamp = (): string => new Date().toISOString();

const toIsoString = (value: string): string | null => {
  const parsed = Date.parse(value);

  if (Number.isNaN(parsed)) {
    return null;
  }

  return new Date(parsed).toISOString();
};

const normaliseDateTime = (value: unknown): string | null => {
  if (!hasValue(value)) {
    return null;
  }

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString();
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();

    if (!trimmed) {
      return null;
    }

    if (ISO_DATE_PATTERN.test(trimmed)) {
      return `${trimmed}T00:00:00Z`;
    }

    if (/T/.test(trimmed) && !/[+-]\d{2}:\d{2}$/.test(trimmed) && !trimmed.endsWith('Z')) {
      return `${trimmed}Z`;
    }

    return toIsoString(trimmed) ?? null;
  }

  return null;
};

const normaliseDate = (value: unknown): string | null => {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();

    if (!trimmed) {
      return null;
    }

    if (ISO_DATE_PATTERN.test(trimmed)) {
      return trimmed;
    }

    const iso = normaliseDateTime(trimmed);
    if (iso) {
      return iso.slice(0, 10);
    }

    const parsed = Date.parse(trimmed);
    if (!Number.isNaN(parsed)) {
      return new Date(parsed).toISOString().slice(0, 10);
    }
  }

  return null;
};

const hasValue = (value: unknown): boolean => {
  if (value === undefined || value === null) {
    return false;
  }

  if (typeof value === 'string') {
    return value.trim().length > 0;
  }

  return true;
};

const textFrom = (value: unknown): string => String(value);

const normaliseUrl = (value: unknown): string | null => {
  if (!hasValue(value)) {
    return null;
  }

  const raw = textFrom(value).trim();

  if (!raw) {
    return null;
  }

  try {
    const resolved = new URL(raw);
    return resolved.href;
  } catch (err) {
    try {
      const resolved = new URL(`http://${raw}`);
      return resolved.href;
    } catch (error) {
      return null;
    }
  }
};

const appendElement = (
  doc: Document,
  parent: Element,
  tagName: string,
  attributes: Record<string, unknown> = {}
): Element => {
  const element = doc.createElement(tagName);

  Object.entries(attributes).forEach(([key, attrValue]) => {
    if (hasValue(attrValue)) {
      element.setAttribute(key, textFrom(attrValue));
    }
  });

  parent.appendChild(element);
  return element;
};

const appendTextElement = (
  doc: Document,
  parent: Element,
  tagName: string,
  value: unknown,
  attributes: Record<string, unknown> = {}
): Element | null => {
  if (!hasValue(value)) {
    return null;
  }

  const element = appendElement(doc, parent, tagName, attributes);
  element.textContent = textFrom(value);
  return element;
};

const appendParagraphs = (doc: Document, parent: Element, value: unknown): boolean => {
  if (!hasValue(value)) {
    return false;
  }

  const paragraphs = textFrom(value)
    .split(/\r?\n/)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0);

  if (!paragraphs.length) {
    return false;
  }

  paragraphs.forEach((paragraph) => {
    const para = doc.createElement('para');
    para.textContent = paragraph;
    parent.appendChild(para);
  });

  return true;
};

const appendParagraphElement = (
  doc: Document,
  parent: Element,
  tagName: string,
  value: unknown
): Element | null => {
  const element = doc.createElement(tagName);
  const hasContent = appendParagraphs(doc, element, value);

  if (!hasContent) {
    return null;
  }

  parent.appendChild(element);
  return element;
};

const removeIfEmpty = (element: Element): void => {
  if (!element.childNodes.length && !element.attributes.length) {
    element.parentNode?.removeChild(element);
  }
};

const normaliseCountry = (value: unknown): string | null => {
  if (!hasValue(value)) {
    return null;
  }

  const raw = textFrom(value).trim();

  if (!raw) {
    return null;
  }

  const upper = raw.toUpperCase();
  const match = (countries as Record<string, string>)[upper];

  return match ?? raw;
};

const getDirectory = (record: JsonRecord, fallback?: string): string | undefined => {
  const direct = record['userId__directory'] ?? record['userIdDirectory'];

  if (hasValue(direct)) {
    return textFrom(direct);
  }

  if (fallback && fallback.trim().length) {
    return fallback;
  }

  return undefined;
};

const appendIndividualName = (doc: Document, parent: Element, data: JsonRecord): void => {
  if (!hasValue(data.givenName) && !hasValue(data.surName)) {
    return;
  }

  const individual = appendElement(doc, parent, 'individualName');
  appendTextElement(doc, individual, 'givenName', data.givenName);
  appendTextElement(doc, individual, 'surName', data.surName);
  removeIfEmpty(individual);
};

const appendAddress = (doc: Document, parent: Element, data: JsonRecord): void => {
  const addressFields: Record<string, unknown> = {
    deliveryPoint: data.deliveryPoint,
    city: data.city,
    administrativeArea: data.administrativeArea,
    postalCode: data.postalCode,
    country: normaliseCountry(data.country)
  };

  const hasAnyField = Object.values(addressFields).some((value) => hasValue(value));

  if (!hasAnyField) {
    return;
  }

  const address = appendElement(doc, parent, 'address');
  appendTextElement(doc, address, 'deliveryPoint', addressFields.deliveryPoint);
  appendTextElement(doc, address, 'city', addressFields.city);
  appendTextElement(doc, address, 'administrativeArea', addressFields.administrativeArea);
  appendTextElement(doc, address, 'postalCode', addressFields.postalCode);
  appendTextElement(doc, address, 'country', addressFields.country);
  removeIfEmpty(address);
};

interface PartyOptions {
  includeRole?: boolean;
  defaultUserIdDirectory?: string;
}

const appendPartyList = (
  doc: Document,
  parent: Element,
  tagName: string,
  list: unknown,
  options: PartyOptions = {}
): void => {
  if (!Array.isArray(list)) {
    return;
  }

  list.forEach((entry) => {
    if (!entry || typeof entry !== 'object') {
      return;
    }

    const record = entry as JsonRecord;
    const meaningfulKeys = [
      'givenName',
      'surName',
      'organizationName',
      'positionName',
      'deliveryPoint',
      'city',
      'administrativeArea',
      'postalCode',
      'country',
      'phone',
      'electronicMailAddress',
      'onlineUrl',
      'userId',
      'role'
    ];

    const containsData = meaningfulKeys.some((key) => hasValue(record[key]));

    if (!containsData) {
      return;
    }

    const party = appendElement(doc, parent, tagName);

    appendIndividualName(doc, party, record);
    appendTextElement(doc, party, 'organizationName', record.organizationName);
    appendTextElement(doc, party, 'positionName', record.positionName);
    appendAddress(doc, party, record);
    appendTextElement(doc, party, 'phone', record.phone);
    appendTextElement(doc, party, 'electronicMailAddress', record.electronicMailAddress);

    const onlineUrl = normaliseUrl(record.onlineUrl);
    if (onlineUrl) {
      appendTextElement(doc, party, 'onlineUrl', onlineUrl);
    }

    if (hasValue(record.userId)) {
      const directory = getDirectory(record, options.defaultUserIdDirectory ?? 'http://orcid.org/');
      appendTextElement(doc, party, 'userId', record.userId, directory ? { directory } : {});
    }

    if (options.includeRole) {
      appendTextElement(doc, party, 'role', record.role);
    }

    removeIfEmpty(party);
  });
};

const asPartyArray = (value: unknown): JsonRecord[] => (
  Array.isArray(value)
    ? value.filter((entry): entry is JsonRecord => Boolean(entry) && typeof entry === 'object')
    : []
);

const combinePartyLists = (primary: JsonRecord[], fallback: JsonRecord[]): JsonRecord[] => {
  if (primary.length && fallback.length) {
    return [...primary, ...fallback];
  }

  return primary.length ? primary : fallback;
};

const appendKeywordSets = (doc: Document, parent: Element, list: unknown): void => {
  if (!Array.isArray(list)) {
    return;
  }

  list.forEach((entry) => {
    if (!entry || typeof entry !== 'object') {
      return;
    }

    const record = entry as JsonRecord;
    const keyword = record.keyword;
    const keywordThesaurus = record.keywordThesaurus;

    if (!hasValue(keyword) && !hasValue(keywordThesaurus)) {
      return;
    }

    const keywordSet = appendElement(doc, parent, 'keywordSet');
    appendTextElement(doc, keywordSet, 'keyword', keyword);
    appendTextElement(doc, keywordSet, 'keywordThesaurus', keywordThesaurus);
    removeIfEmpty(keywordSet);
  });
};

const appendDistribution = (doc: Document, parent: Element, data: unknown): void => {
  if (!data || typeof data !== 'object') {
    return;
  }

  const record = data as JsonRecord;
  const url = normaliseUrl(record.url);

  if (!url) {
    return;
  }

  const distribution = appendElement(doc, parent, 'distribution', { scope: 'document' });
  const online = appendElement(doc, distribution, 'online');
  appendTextElement(doc, online, 'url', url, { function: 'information' });
  removeIfEmpty(online);
  removeIfEmpty(distribution);
};

const appendBoundingCoordinates = (doc: Document, parent: Element, data: JsonRecord): boolean => {
  const fields: Record<string, unknown> = {
    westBoundingCoordinate: data.westBoundingCoordinate,
    eastBoundingCoordinate: data.eastBoundingCoordinate,
    northBoundingCoordinate: data.northBoundingCoordinate,
    southBoundingCoordinate: data.southBoundingCoordinate
  };

  const hasAny = Object.values(fields).some((value) => hasValue(value));

  if (!hasAny) {
    return false;
  }

  const bounding = appendElement(doc, parent, 'boundingCoordinates');
  Object.entries(fields).forEach(([key, value]) => {
    appendTextElement(doc, bounding, key, value);
  });
  removeIfEmpty(bounding);
  return true;
};

const appendGeographicCoverage = (doc: Document, parent: Element, data: JsonRecord | undefined): boolean => {
  if (!data) {
    return false;
  }

  const geographic = doc.createElement('geographicCoverage');
  appendTextElement(doc, geographic, 'geographicDescription', data.geographicDescription);
  const addedBounding = appendBoundingCoordinates(doc, geographic, data);

  if (!geographic.childNodes.length) {
    return false;
  }

  parent.appendChild(geographic);
  return addedBounding || hasValue(data.geographicDescription);
};

const appendSingleDateTime = (doc: Document, coverage: Element, data: JsonRecord | undefined): boolean => {
  if (!data || !hasValue(data.calendarDate)) {
    return false;
  }

  const temporal = appendElement(doc, coverage, 'temporalCoverage');
  const single = appendElement(doc, temporal, 'singleDateTime');
  appendTextElement(doc, single, 'calendarDate', data.calendarDate);
  removeIfEmpty(single);
  removeIfEmpty(temporal);
  return true;
};

const appendRangeOfDates = (doc: Document, coverage: Element, data: JsonRecord | undefined): boolean => {
  if (!data) {
    return false;
  }

  const begin = data.beginDate && typeof data.beginDate === 'object' ? (data.beginDate as JsonRecord).calendarDate : undefined;
  const end = data.endDate && typeof data.endDate === 'object' ? (data.endDate as JsonRecord).calendarDate : undefined;

  if (!hasValue(begin) && !hasValue(end)) {
    return false;
  }

  const temporal = appendElement(doc, coverage, 'temporalCoverage');
  const range = appendElement(doc, temporal, 'rangeOfDates');
  const beginDate = appendElement(doc, range, 'beginDate');
  appendTextElement(doc, beginDate, 'calendarDate', begin);
  removeIfEmpty(beginDate);
  const endDate = appendElement(doc, range, 'endDate');
  appendTextElement(doc, endDate, 'calendarDate', end);
  removeIfEmpty(endDate);
  removeIfEmpty(range);
  removeIfEmpty(temporal);
  return true;
};

const appendTemporalRangeEntry = (doc: Document, coverage: Element, record: JsonRecord): boolean => {
  const start = normaliseDate(record.startDate) ?? record.startDate;
  const end = normaliseDate(record.endDate) ?? record.endDate;

  if (!hasValue(start) && !hasValue(end)) {
    return false;
  }

  const temporal = appendElement(doc, coverage, 'temporalCoverage');
  const range = appendElement(doc, temporal, 'rangeOfDates');
  const beginDate = appendElement(doc, range, 'beginDate');
  appendTextElement(doc, beginDate, 'calendarDate', start);
  removeIfEmpty(beginDate);
  const endDate = appendElement(doc, range, 'endDate');
  appendTextElement(doc, endDate, 'calendarDate', end);
  removeIfEmpty(endDate);
  removeIfEmpty(range);

  if (!range.childNodes.length) {
    range.parentNode?.removeChild(range);
  }

  if (!temporal.childNodes.length) {
    temporal.parentNode?.removeChild(temporal);
    return false;
  }

  return true;
};

const appendTemporalSingleEntry = (doc: Document, coverage: Element, record: JsonRecord): boolean => {
  const date = normaliseDate(record.startDate) ?? record.startDate;

  if (!hasValue(date)) {
    return false;
  }

  const temporal = appendElement(doc, coverage, 'temporalCoverage');
  const single = appendElement(doc, temporal, 'singleDateTime');
  appendTextElement(doc, single, 'calendarDate', date);
  removeIfEmpty(single);

  if (!temporal.childNodes.length) {
    temporal.parentNode?.removeChild(temporal);
    return false;
  }

  return true;
};

const appendTemporalTextEntry = (doc: Document, coverage: Element, tagName: string, value: unknown): boolean => {
  if (!hasValue(value)) {
    return false;
  }

  const temporal = appendElement(doc, coverage, 'temporalCoverage');
  appendTextElement(doc, temporal, tagName, value);

  if (!temporal.childNodes.length) {
    temporal.parentNode?.removeChild(temporal);
    return false;
  }

  return true;
};

const appendTemporalCoverageEntries = (doc: Document, coverage: Element, list: unknown): boolean => {
  if (!Array.isArray(list)) {
    return false;
  }

  let appended = false;

  list.forEach((entry) => {
    if (!entry || typeof entry !== 'object') {
      return;
    }

    const record = entry as JsonRecord;
    if (!hasValue(record.type)) {
      return;
    }

    const type = textFrom(record.type).toUpperCase();
    let added = false;

    switch (type) {
      case 'DATE_RANGE':
        added = appendTemporalRangeEntry(doc, coverage, record);
        break;
      case 'SINGLE_DATE':
        added = appendTemporalSingleEntry(doc, coverage, record);
        break;
      case 'FORMATION_PERIOD':
        added = appendTemporalTextEntry(doc, coverage, 'formationPeriod', record.formationPeriod);
        break;
      case 'LIVING_TIME_PERIOD':
        added = appendTemporalTextEntry(doc, coverage, 'livingTimePeriod', record.livingTimePeriod);
        break;
      default:
        break;
    }

    appended = appended || added;
  });

  return appended;
};

const extractTemporalValue = (list: unknown, type: string, key: string): unknown => {
  if (!Array.isArray(list)) {
    return undefined;
  }

  for (const entry of list) {
    if (!entry || typeof entry !== 'object') {
      continue;
    }

    const record = entry as JsonRecord;
    if (!hasValue(record.type)) {
      continue;
    }

    const recordType = textFrom(record.type).toUpperCase();
    if (recordType !== type) {
      continue;
    }

    const value = record[key];
    if (hasValue(value)) {
      return value;
    }
  }

  return undefined;
};

const appendTaxonomicCoverage = (doc: Document, coverage: Element, data: JsonRecord | undefined): boolean => {
  if (!data) {
    return false;
  }

  const taxonomic = doc.createElement('taxonomicCoverage');
  appendTextElement(doc, taxonomic, 'generalTaxonomicCoverage', data.generalTaxonomicCoverage);

  if (Array.isArray(data.taxonomicClassification)) {
    data.taxonomicClassification.forEach((entry) => {
      if (!entry || typeof entry !== 'object') {
        return;
      }

      const record = entry as JsonRecord;
      const hasTaxonData = ['taxonRankName', 'taxonRankValue', 'commonName'].some((key) => hasValue(record[key]));

      if (!hasTaxonData) {
        return;
      }

      const classification = appendElement(doc, taxonomic, 'taxonomicClassification');
      appendTextElement(doc, classification, 'taxonRankName', record.taxonRankName);
      appendTextElement(doc, classification, 'taxonRankValue', record.taxonRankValue);
      appendTextElement(doc, classification, 'commonName', record.commonName);
      removeIfEmpty(classification);
    });
  }

  if (!taxonomic.childNodes.length) {
    return false;
  }

  coverage.appendChild(taxonomic);
  return true;
};

const appendCoverage = (doc: Document, parent: Element, data: JsonRecord): void => {
  const coverage = doc.createElement('coverage');

  const geographicData = (data.geographicCoverage && typeof data.geographicCoverage === 'object')
    ? (data.geographicCoverage as JsonRecord)
    : undefined;
  const temporalSingle = (data.singleDateTime && typeof data.singleDateTime === 'object')
    ? (data.singleDateTime as JsonRecord)
    : undefined;
  const temporalRange = (data.rangeOfDates && typeof data.rangeOfDates === 'object')
    ? (data.rangeOfDates as JsonRecord)
    : undefined;

  let taxonomicData: JsonRecord | undefined;
  if (data.taxonomicCoverage && typeof data.taxonomicCoverage === 'object') {
    taxonomicData = data.taxonomicCoverage as JsonRecord;
  } else {
    const general = data.generalTaxonomicCoverage;
    const classification = data.taxonomicClassification;
    if (hasValue(general) || Array.isArray(classification)) {
      taxonomicData = {
        generalTaxonomicCoverage: general,
        taxonomicClassification: classification
      } as JsonRecord;
    }
  }

  const addedGeographic = appendGeographicCoverage(doc, coverage, geographicData);
  const addedTemporalEntries = appendTemporalCoverageEntries(doc, coverage, data.temporalCoverages);
  const addedSingle = appendSingleDateTime(doc, coverage, temporalSingle);
  const addedRange = appendRangeOfDates(doc, coverage, temporalRange);
  const addedTaxonomic = appendTaxonomicCoverage(doc, coverage, taxonomicData);

  if (addedGeographic || addedTemporalEntries || addedSingle || addedRange || addedTaxonomic) {
    parent.appendChild(coverage);
  }
};

const appendMethods = (doc: Document, parent: Element, data: JsonRecord): void => {
  const methods = doc.createElement('methods');

  if (Array.isArray(data.methodStep)) {
    data.methodStep.forEach((entry) => {
      if (!entry || typeof entry !== 'object') {
        return;
      }

      const record = entry as JsonRecord;
      if (!hasValue(record.description)) {
        return;
      }

      const methodStep = appendElement(doc, methods, 'methodStep');
      const description = appendElement(doc, methodStep, 'description');
      if (!appendParagraphs(doc, description, record.description)) {
        description.parentNode?.removeChild(description);
      }
      removeIfEmpty(methodStep);
    });
  }

  if (hasValue(data.studyExtent) || hasValue(data.samplingDescription)) {
    const sampling = appendElement(doc, methods, 'sampling');

    if (hasValue(data.studyExtent)) {
      const studyExtent = appendElement(doc, sampling, 'studyExtent');
      const description = appendElement(doc, studyExtent, 'description');
      if (!appendParagraphs(doc, description, data.studyExtent)) {
        description.parentNode?.removeChild(description);
      }
      removeIfEmpty(studyExtent);
    }

    if (hasValue(data.samplingDescription)) {
      const samplingDescription = appendElement(doc, sampling, 'samplingDescription');
      if (!appendParagraphs(doc, samplingDescription, data.samplingDescription)) {
        samplingDescription.parentNode?.removeChild(samplingDescription);
      }
    }

    removeIfEmpty(sampling);
  }

  if (hasValue(data.qualityControl)) {
    const qualityControl = appendElement(doc, methods, 'qualityControl');
    const description = appendElement(doc, qualityControl, 'description');
    if (!appendParagraphs(doc, description, data.qualityControl)) {
      description.parentNode?.removeChild(description);
    }
    removeIfEmpty(qualityControl);
  }

  removeIfEmpty(methods);

  if (methods.childNodes.length) {
    parent.appendChild(methods);
  }
};

const appendProject = (doc: Document, parent: Element, projectData: JsonRecord | undefined): void => {
  if (!projectData) {
    return;
  }

  const hasProjectContent = [
    'title',
    'abstract',
    'funding',
    'personnel',
    'studyAreaDescription',
    'designDescription'
  ].some((key) => hasValue(projectData[key]));

  if (!hasProjectContent) {
    return;
  }

  const project = appendElement(doc, parent, 'project');

  if (hasValue(projectData.id)) {
    project.setAttribute('id', textFrom(projectData.id));
  }

  appendTextElement(doc, project, 'title', projectData.title);

  if (Array.isArray(projectData.personnel)) {
    projectData.personnel.forEach((entry) => {
      if (!entry || typeof entry !== 'object') {
        return;
      }

      const record = entry as JsonRecord;
      const hasPersonnelData = ['givenName', 'surName', 'userId', 'role'].some((key) => hasValue(record[key]));

      if (!hasPersonnelData) {
        return;
      }

      const personnel = appendElement(doc, project, 'personnel');
      appendIndividualName(doc, personnel, record);

      if (hasValue(record.userId)) {
        const directory = getDirectory(record, 'http://orcid.org/');
        appendTextElement(doc, personnel, 'userId', record.userId, directory ? { directory } : {});
      }

      appendTextElement(doc, personnel, 'role', record.role);
      removeIfEmpty(personnel);
    });
  }

  appendParagraphElement(doc, project, 'abstract', projectData.abstract);

  if (hasValue(projectData.funding)) {
    const funding = appendElement(doc, project, 'funding');
    appendParagraphs(doc, funding, projectData.funding);
    removeIfEmpty(funding);
  }

  if (hasValue(projectData.studyAreaDescription)) {
    const studyAreaDescription = appendElement(doc, project, 'studyAreaDescription');
    const descriptorAttributes = {
      name: 'generic',
      citableClassificationSystem: 'false'
    };
    const descriptor = appendElement(doc, studyAreaDescription, 'descriptor', descriptorAttributes);
    appendTextElement(doc, descriptor, 'descriptorValue', projectData.studyAreaDescription);
    removeIfEmpty(descriptor);
    removeIfEmpty(studyAreaDescription);
  }

  if (hasValue(projectData.designDescription)) {
    const designDescription = appendElement(doc, project, 'designDescription');
    const description = appendElement(doc, designDescription, 'description');
    if (!appendParagraphs(doc, description, projectData.designDescription)) {
      description.parentNode?.removeChild(description);
    }
    removeIfEmpty(designDescription);
  }

  removeIfEmpty(project);
};

const appendSpecimenPreservation = (doc: Document, parent: Element, list: unknown): void => {
  if (!Array.isArray(list)) {
    return;
  }

  list.forEach((entry) => {
    if (!hasValue(entry)) {
      return;
    }

    appendTextElement(doc, parent, 'specimenPreservationMethod', entry);
  });
};

const appendCuratorialUnits = (doc: Document, parent: Element, list: unknown): void => {
  if (!Array.isArray(list)) {
    return;
  }

  list.forEach((entry) => {
    if (!entry || typeof entry !== 'object') {
      return;
    }

    const record = entry as JsonRecord;
    const hasRange = hasValue(record.beginRange) || hasValue(record.endRange);
    const hasType = hasValue(record.jgtiUnitType);

    if (!hasRange && !hasType) {
      return;
    }

    const unit = appendElement(doc, parent, 'jgtiCuratorialUnit');
    appendTextElement(doc, unit, 'jgtiUnitType', record.jgtiUnitType);

    if (hasRange) {
      const range = appendElement(doc, unit, 'jgtiUnitRange');
      appendTextElement(doc, range, 'beginRange', record.beginRange);
      appendTextElement(doc, range, 'endRange', record.endRange);
      removeIfEmpty(range);
    }

    removeIfEmpty(unit);
  });
};

const appendCollection = (doc: Document, parent: Element, list: unknown): void => {
  if (!Array.isArray(list)) {
    return;
  }

  list.forEach((entry) => {
    if (!entry || typeof entry !== 'object') {
      return;
    }

    const record = entry as JsonRecord;
    const hasCollectionData = ['parentCollectionIdentifier', 'collectionIdentifier', 'collectionName']
      .some((key) => hasValue(record[key]));

    if (!hasCollectionData) {
      return;
    }

    const collection = appendElement(doc, parent, 'collection');
    appendTextElement(doc, collection, 'parentCollectionIdentifier', record.parentCollectionIdentifier);
    appendTextElement(doc, collection, 'collectionIdentifier', record.collectionIdentifier);
    appendTextElement(doc, collection, 'collectionName', record.collectionName);
    removeIfEmpty(collection);
  });
};

const appendPhysicalItems = (doc: Document, parent: Element, list: unknown): void => {
  if (!Array.isArray(list)) {
    return;
  }

  list.forEach((entry) => {
    if (!entry || typeof entry !== 'object') {
      return;
    }

    const record = entry as JsonRecord;
    const hasPhysicalData = [
      'objectName',
      'characterEncoding',
      'formatName',
      'formatVersion',
      'url'
    ].some((key) => hasValue(record[key]));

    if (!hasPhysicalData) {
      return;
    }

    const physical = appendElement(doc, parent, 'physical');
    appendTextElement(doc, physical, 'objectName', record.objectName);
    appendTextElement(doc, physical, 'characterEncoding', record.characterEncoding);

    if (hasValue(record.formatName) || hasValue(record.formatVersion)) {
      const dataFormat = appendElement(doc, physical, 'dataFormat');
      const externalFormat = appendElement(doc, dataFormat, 'externallyDefinedFormat');
      appendTextElement(doc, externalFormat, 'formatName', record.formatName);
      appendTextElement(doc, externalFormat, 'formatVersion', record.formatVersion);
      removeIfEmpty(externalFormat);
      removeIfEmpty(dataFormat);
    }

    const formattedUrl = normaliseUrl(record.url);

    if (formattedUrl) {
      const distribution = appendElement(doc, physical, 'distribution');
      const online = appendElement(doc, distribution, 'online');
      appendTextElement(doc, online, 'url', formattedUrl, { function: 'download' });
      removeIfEmpty(online);
      removeIfEmpty(distribution);
    }

    removeIfEmpty(physical);
  });
};

const appendBibliography = (doc: Document, parent: Element, list: unknown): void => {
  if (!Array.isArray(list)) {
    return;
  }

  list.forEach((entry) => {
    if (!entry || typeof entry !== 'object') {
      return;
    }

    const record = entry as JsonRecord;

    if (!hasValue(record.citation)) {
      return;
    }

    const attributes = hasValue(record.citation__identifier)
      ? { identifier: textFrom(record.citation__identifier) }
      : {};

    const bibliography = appendElement(doc, parent, 'bibliography');
    appendTextElement(doc, bibliography, 'citation', record.citation, attributes);
    removeIfEmpty(bibliography);
  });
};

const appendAdditionalMetadata = (doc: Document, parent: Element, data: JsonRecord): void => {
  const gbifData = (data.additionalMetadata && typeof data.additionalMetadata === 'object')
    ? (data.additionalMetadata as JsonRecord)
    : {};

  const additionalMetadata = doc.createElement('additionalMetadata');
  const metadata = appendElement(doc, additionalMetadata, 'metadata');
  const gbif = appendElement(doc, metadata, 'gbif');

  const hierarchyLevel = gbifData.hierarchyLevel ?? 'dataset';

  const dateStampCandidate = hasValue(gbifData.dateStamp)
    ? gbifData.dateStamp
    : hasValue(data.dateStamp)
      ? data.dateStamp
      : data.pubDate;

  const dateStampValue = normaliseDateTime(dateStampCandidate) ?? defaultDateStamp();

  appendTextElement(doc, gbif, 'dateStamp', dateStampValue);
  appendTextElement(doc, gbif, 'hierarchyLevel', hierarchyLevel);

  const citationAttributes = hasValue(gbifData.citation__identifier ?? data.citation__identifier)
    ? { identifier: textFrom(gbifData.citation__identifier ?? data.citation__identifier) }
    : {};
  appendTextElement(doc, gbif, 'citation', gbifData.citation ?? data.citation, citationAttributes);

  appendBibliography(doc, gbif, data.bibliography ?? gbifData.bibliography);
  appendPhysicalItems(doc, gbif, data.physical ?? gbifData.physical);
  const resourceLogoUrl = normaliseUrl(gbifData.resourceLogoUrl ?? data.resourceLogoUrl);
  if (resourceLogoUrl) {
    appendTextElement(doc, gbif, 'resourceLogoUrl', resourceLogoUrl);
  }
  appendCollection(doc, gbif, data.collection ?? gbifData.collection);
  const temporalFormation = extractTemporalValue(data.temporalCoverages, 'FORMATION_PERIOD', 'formationPeriod');
  const temporalLiving = extractTemporalValue(data.temporalCoverages, 'LIVING_TIME_PERIOD', 'livingTimePeriod');

  appendTextElement(doc, gbif, 'formationPeriod', gbifData.formationPeriod ?? data.formationPeriod ?? temporalFormation);
  appendTextElement(doc, gbif, 'livingTimePeriod', gbifData.livingTimePeriod ?? data.livingTimePeriod ?? temporalLiving);
  appendSpecimenPreservation(doc, gbif, data.specimenPreservationMethod ?? gbifData.specimenPreservationMethod);
  appendCuratorialUnits(doc, gbif, data.jgtiCuratorialUnit ?? gbifData.jgtiCuratorialUnit);

  const replacesValue = gbifData.replaces ?? data.replaces;
  if (hasValue(replacesValue)) {
    const replaces = doc.createElementNS('http://purl.org/dc/terms/', 'dc:replaces');
    replaces.textContent = textFrom(replacesValue);
    gbif.appendChild(replaces);
  }

  removeIfEmpty(gbif);
  removeIfEmpty(metadata);
  removeIfEmpty(additionalMetadata);

  if (additionalMetadata.childNodes.length) {
    parent.appendChild(additionalMetadata);
  }
};

const appendIntellectualRights = (doc: Document, parent: Element): void => {
  const rights = appendElement(doc, parent, 'intellectualRights');
  const paragraph = doc.createElement('para');
  paragraph.appendChild(doc.createTextNode('This work is licensed under a '));

  const ulink = doc.createElement('ulink');
  ulink.setAttribute('url', 'http://creativecommons.org/licenses/by/4.0/legalcode');
  const citeTitle = doc.createElement('citetitle');
  citeTitle.textContent = 'Creative Commons Attribution (CC-BY) 4.0 License';
  ulink.appendChild(citeTitle);

  paragraph.appendChild(ulink);
  paragraph.appendChild(doc.createTextNode('.'));
  rights.appendChild(paragraph);
};

const setRootAttributes = (root: Element, data: JsonRecord): void => {
  root.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:dc', 'http://purl.org/dc/terms/');
  root.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:xsi', XSI_NS);
  root.setAttributeNS(XSI_NS, 'xsi:schemaLocation',
    'eml://ecoinformatics.org/eml-2.1.1 http://rs.gbif.org/schema/eml-gbif-profile/1.1/eml.xsd');

  const packageId = data.packageId ?? 'https://ipt.gbif.no/resource?id=test/v1.1';
  const system = data.system ?? 'http://gbif.org';
  const scope = data.scope ?? 'system';
  const language = (data.xmlLang && hasValue(data.xmlLang)) ? textFrom(data.xmlLang) : DEFAULT_LANGUAGE;

  root.setAttribute('packageId', textFrom(packageId));
  root.setAttribute('system', textFrom(system));
  root.setAttribute('scope', textFrom(scope));
  root.setAttributeNS(XML_NS, 'xml:lang', language);
};

const appendAlternateIdentifiers = (doc: Document, parent: Element, value: unknown): void => {
  if (Array.isArray(value)) {
    value.forEach((entry) => {
      appendTextElement(doc, parent, 'alternateIdentifier', entry);
    });
    return;
  }

  appendTextElement(doc, parent, 'alternateIdentifier', value);
};

const buildDataset = (doc: Document, root: Element, data: JsonRecord): void => {
  const dataset = appendElement(doc, root, 'dataset');

  appendAlternateIdentifiers(doc, dataset, data.alternateIdentifier);
  const titleValue = hasValue(data.title) ? data.title : DEFAULT_TITLE;
  appendTextElement(doc, dataset, 'title', titleValue, { 'xml:lang': DEFAULT_LANGUAGE });
  const resourceContacts = asPartyArray(data.resourceContact);
  const creators = combinePartyLists(resourceContacts, asPartyArray(data.creator));
  const contacts = combinePartyLists(resourceContacts, asPartyArray(data.contact));
  const metadataProviders = combinePartyLists(resourceContacts, asPartyArray(data.metadataProvider));

  appendPartyList(doc, dataset, 'creator', creators, { defaultUserIdDirectory: 'http://orcid.org/' });
  appendPartyList(doc, dataset, 'metadataProvider', metadataProviders, { defaultUserIdDirectory: 'http://orcid.org/' });
  appendPartyList(doc, dataset, 'associatedParty', data.associatedParty, { includeRole: true, defaultUserIdDirectory: 'http://orcid.org/' });

  const pubDateValue = normaliseDate(data.pubDate)
    ?? normaliseDate((data.publicationDate as unknown) ?? undefined)
    ?? normaliseDate((data.dateStamp as unknown) ?? undefined)
    ?? normaliseDate(
      data.additionalMetadata && typeof data.additionalMetadata === 'object'
        ? (data.additionalMetadata as JsonRecord).dateStamp
        : undefined
    )
    ?? defaultDateStamp().slice(0, 10);

  appendTextElement(doc, dataset, 'pubDate', pubDateValue);
  const languageValue = hasValue(data.language) ? data.language : DEFAULT_LANGUAGE;
  appendTextElement(doc, dataset, 'language', languageValue);
  appendParagraphElement(doc, dataset, 'abstract', data.abstract);
  appendKeywordSets(doc, dataset, data.keywordSet);
  appendParagraphElement(doc, dataset, 'additionalInfo', data.additionalInfo);
  appendIntellectualRights(doc, dataset);
  appendDistribution(doc, dataset, data.online);
  appendCoverage(doc, dataset, data);
  appendParagraphElement(doc, dataset, 'purpose', data.purpose);

  if (data.maintenance && typeof data.maintenance === 'object') {
    const maintenanceRecord = data.maintenance as JsonRecord;
    if (hasValue(maintenanceRecord.description) || hasValue(maintenanceRecord.maintenanceUpdateFrequency)) {
      const maintenance = appendElement(doc, dataset, 'maintenance');
      if (hasValue(maintenanceRecord.description)) {
        const description = appendElement(doc, maintenance, 'description');
        if (!appendParagraphs(doc, description, maintenanceRecord.description)) {
          description.parentNode?.removeChild(description);
        }
      }
      appendTextElement(doc, maintenance, 'maintenanceUpdateFrequency', maintenanceRecord.maintenanceUpdateFrequency);
      removeIfEmpty(maintenance);
    }
  }

  appendPartyList(doc, dataset, 'contact', contacts, { defaultUserIdDirectory: 'http://orcid.org/' });
  appendMethods(doc, dataset, data);
  const projectData = data.project && typeof data.project === 'object' ? (data.project as JsonRecord) : undefined;
  appendProject(doc, dataset, projectData);
  removeIfEmpty(dataset);
};

const MakePopulatedEML = (jsonformsData: JsonRecord): string => {
  const data: JsonRecord = jsonformsData ?? {};

  const doc = document.implementation.createDocument(EML_NS, 'eml:eml');
  const root = doc.documentElement;
  setRootAttributes(root, data);

  buildDataset(doc, root, data);
  appendAdditionalMetadata(doc, root, data);

  const serializer = new XMLSerializer();
  return serializer.serializeToString(doc);
};

export default MakePopulatedEML;
