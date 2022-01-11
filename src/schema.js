import countries from './countries.js';
import eml from './ApplicationResources_en.properties.js';

const person_items = {
  type: 'object',
  properties: {
    givenName:              { type: 'string', title: 'First name' },
    surName:                { type: 'string', title: 'Surname' },
    electronicMailAddress:  { type: 'string', title: 'Email' },
    positionName:           { type: 'string' },
    organizationName:       { type: 'string' },
    city:                   { type: 'string' },
    country:                { type: 'string', enum: Object.keys(countries), description: 'Countries, territories, and islands are based on the ISO 3166-1 standard.' },
    userId:                 { type: 'string', title: 'ORCID' }
  }
}

var schema = {
  type: 'object',
  properties: {
    title: { type: 'string', title: 'Dataset title' },
    abstract: { type: 'string', title: 'Description' },
    creator: { type: 'array', title: 'Creator(s) - those who created the resource, in priority order.', items: person_items },
    contact: { type: 'array', title: 'Contact(s) - curators of the resource who should be contacted for more information or to fix data problems.', items: person_items },
    metadataProvider: { type: 'array', title: 'Metadata Provider(s) - those responsible for producing the resource metadata.', items: person_items },
    associatedParty: { type: 'array', title: 'Associated person(s) - others associated with the resource.', items: person_items },
    geographicCoverage: {
      type: 'object',
      title: 'Geographic coverage in decimal degrees - use dot . as a decimal separator',
      properties: {
        westBoundingCoordinate:   { type: 'string', title: 'West' },
        eastBoundingCoordinate:   { type: 'string', title: 'East' },
        northBoundingCoordinate:  { type: 'string', title: 'North' },
        southBoundingCoordinate:  { type: 'string', title: 'South' }
      }
    },
    geographicDescription: { type: 'string', title: 'Description' },
    taxonomicCoverage: {
      type: 'object',
      properties: {
        generalTaxonomicCoverage: { type: 'string' },
        taxonomicClassification: {
          type: 'array',
          title: 'Specific taxon list (optional)',
          items: {
            type: 'object',
            properties: {
              taxonRankName: { type: 'string', title: 'Rank', enum: ['domain', 'kingdom', 'subkingdom', 'superphylum', 'phylum', 'subphylum', 'superclass', 'class', 'subclass', 'supercohort', 'cohort', 'subcohort', 'superorder', 'order', 'suborder', 'infraorder', 'superfamily', 'family', 'subfamily', 'tribe', 'subtribe', 'supragenericname', 'genus', 'subgenus', 'section', 'subsection', 'series', 'subseries', 'speciesAggregate', 'infragenericname', 'species', 'subspecificAggregate', 'infraspecificname', 'subspecies', 'infrasubspecificname', 'variety', 'subvariety', 'form', 'subform', 'pathovar', 'biovar', 'chemovar', 'morphovar', 'phagovar', 'serovar', 'chemoform', 'formaspecialis', 'cultivarGroup', 'cultivar', 'strain', 'informal', 'unranked'] },
              taxonRankValue: { type: 'string', title: 'Scientific name' },
              commonName: { type: 'string' },
            }
          }
        }
      }
    },
    singleDateTime: {
      type: 'object',
      properties: { calendarDate: { type: 'string', format: 'date', title: ' - or Single Date' } }
    },
    rangeOfDates:   {
      type: 'object',
      properties: {
        beginDate: {
          type: 'object',
          properties: { calendarDate: { type: 'string', format: 'date', title: 'Begin' } }
        },
        endDate: {
          type: 'object',
          properties: { calendarDate: { type: 'string', format: 'date', title: 'End' } }
        }
      }
    },
    additionalMetadata: {
      type: 'object',
      properties: {
        formationPeriod: { type: 'string', title: ' - or Formation Period' },
        livingTimePeriod: { type: 'string', title: ' - or Living Time Period' }
      }
    },
    project: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        abstract: { type: 'string' },
        funding: { type: 'string' }
      }
    },
    keywordSet: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          keywordThesaurus: { type: 'string', description: 'A name for the keyword thesaurus/vocabulary from which the keywords were derived. Keyword thesauri are usually discipline-specific and can be custom or official. If the keywords are not drawn from a specific thesaurus or vocabulary, enter "na". Example(s): "IRIS keyword thesaurus"' },
          keyword: { type: 'string', title: 'Keyword List' }
        }
      }
    },
    methodStep: {
      type: 'array',
      items: { type: 'object', properties: { description: { type: 'string'} } },
      title: 'Method steps - list methods used in the study and steps leading to the production of the data files, in enough detail to allow for replication. E.g. relevant literature, software, instrumentation, source data and any quality control measures taken.'
    },
    studyExtent: { type: 'string'},
    samplingDescription: { type: 'string'},
    qualityControl: { type: 'string'},
    bibliography: {
      type: 'array',
      title: 'Bibliography - cite external resources related to/used in the creation of this resource.',
      items: {
        type: 'object',
        properties: {
          citation: { type: 'string'},
          citation__identifier: { type: 'string' }
        },
        required: ['citation', 'citation__identifier']
      }
    },
    collection: {
      type: 'array',
      title: 'Collections - list any collections which this resource is based on',
      items: {
        type: 'object',
        properties: {
          collectionName: { type: 'string' },
          collectionIdentifier:  { type: 'string' },
          parentCollectionIdentifier: { type: 'string' }
        }
      }
    },
    specimenPreservationMethod: { type: 'array', items: { type: 'string', enum: ['noTreatment', 'alcohol', 'deepFrozen', 'dried', 'driedAndPressed', 'formalin', 'refrigerated', 'freezeDried-dried', 'glycerin', 'gumArabic', 'microscopicPreparation', 'mounted', 'pinned', 'other'] } },
    jgtiCuratorialUnit: {
      type: 'array',
      title: ' Curatorial Units - count range',
      items: {
        type: 'object',
        properties: {
          beginRange:  { type: 'string', format: 'date' },
          endRange: { type: 'string', format: 'date' }
        }
      }
    },
    online: { type: 'object', properties: { url: { type: 'string', title: 'Resource Homepage' } } },
    physical: {
      type: 'array',
      title: 'Other Data Formats',
      items: {
        type: 'object',
        properties: {
          objectName: { type: 'string', title: 'Name' },
          characterEncoding:  { type: 'string' },
          formatName: { type: 'string' },
          formatVersion: { type: 'string' },
          url: { type: 'string' }
        }
      }
    },
    purpose: { type: 'string' },
    maintenance: {
      type: 'object',
      properties: { description: { type: 'string', title: 'Maintenance' } }
    },
    additionalInfo: { type: 'string' },
    alternateIdentifier: { type: 'array', title: 'Alternative Identifier(s)', items: { type: 'string' } }
  },
  //required: ['title', 'abstract', 'creator', 'contact']
};

// Populate with description help text
for(var path in eml) {
  var parts = path.replace('eml.', '').split('.')
  const last = parts.pop()

  if(last === 'help') {
    var node = schema['properties'];

    for (var j = 0; j < parts.length; j++) {
      const x = parts[j];
      if(x in node) {
        node = node[x];
        if(typeof node === 'object' && 'properties' in node && j !== (parts.length - 1)) {
          node = node['properties'];
        }
      }
      else {
        if(parts.at(-1) in node) {
          node = node[parts.at(-1)]
        };
        break;
      }
    };

    if(node !== schema['properties']) {
      node.description = eml[path];
    }
  }
};

export default schema;
