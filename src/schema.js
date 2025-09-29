import countries from './countries.js';

const person_items = {
  type: 'object',
  required: ['surName', 'electronicMailAddress'],
  properties: {
    givenName:             { type: 'string', title: 'First name' },
    surName:               { type: 'string', title: 'Surname*' },
    electronicMailAddress: { type: 'string', title: 'Email*', format: 'email' },
    positionName:          { type: 'string' },
    organizationName:      { type: 'string' },
    city:                  { type: 'string' },
    country: {
      type: 'string',
      enum: Object.keys(countries),
      description: 'Countries, territories, and islands are based on the ISO 3166-1 standard.'
    },
    userId: { type: 'string', title: 'ORCID' }
  }
};

var schema = {
  type: 'object',
  required: ['title', 'abstract', 'resourceContact'],
  properties: {
    title: { type: 'string', title: 'Dataset title', minLength: 1 },
    abstract: {
      type: 'string',
      title: 'Description',
      description: 'A brief overview of the resource that is being documented, broken into paragraphs.',
      minLength: 1
    },
    resourceContact: {
      type: 'array',
      title: 'Resource contact(s)* - At least 1 is REQUIRED',
      description: 'Add the people responsible for this resource once here.',
      minItems: 1,
      items: person_items
    },
    associatedParty: {
      type: 'array',
      title: 'Associated person(s) - Optional',
      items: person_items
    },
    geographicCoverage: {
      type: 'object',
      title: 'Geographic Coverage',
      description: 'Define the geographic extent of your dataset using the interactive map or coordinate inputs',
      properties: {
        westBoundingCoordinate:   { type: 'string', title: 'West' },
        eastBoundingCoordinate:   { type: 'string', title: 'East' },
        northBoundingCoordinate:  { type: 'string', title: 'North' },
        southBoundingCoordinate:  { type: 'string', title: 'South' }
      }
    },
    taxonomicCoverage: {
      type: 'object',
      required: ['taxonomicClassification'],
      properties: {
        generalTaxonomicCoverage: { type: 'string', title: 'General taxonomic coverage' },
        taxonomicClassification: {
          type: 'array',
          title: 'Specific taxon list (required)',
          minItems: 1,
          items: {
            type: 'object',
            required: ['taxonRankName', 'taxonRankValue'],
            properties: {
              taxonRankName: { type: 'string', title: 'Rank*', enum: ['domain', 'kingdom', 'subkingdom', 'superphylum', 'phylum', 'subphylum', 'superclass', 'class', 'subclass', 'supercohort', 'cohort', 'subcohort', 'superorder', 'order', 'suborder', 'infraorder', 'superfamily', 'family', 'subfamily', 'tribe', 'subtribe', 'supragenericname', 'genus', 'subgenus', 'section', 'subsection', 'series', 'subseries', 'speciesAggregate', 'infragenericname', 'species', 'subspecificAggregate', 'infraspecificname', 'subspecies', 'infrasubspecificname', 'variety', 'subvariety', 'form', 'subform', 'pathovar', 'biovar', 'chemovar', 'morphovar', 'phagovar', 'serovar', 'chemoform', 'formaspecialis', 'cultivarGroup', 'cultivar', 'strain', 'informal', 'unranked'] },
              taxonRankValue: { type: 'string', title: 'Scientific name*' },
              commonName: { type: 'string', title: 'Common name' },
            }
          }
        }
      }
    },
    /*temporalCoverage: {
      type: 'object',
      definitions: {
        singleDateTimeNested: {
          type: 'object',
          properties: {
            singleDateTime: {
              type: 'object',
              title: 'Single date',
              properties: { calendarDate: { type: 'string', format: 'date' } }
            }
          }
        },
        rangeOfDates:   {
          type: 'object',
          title: '- or Date range',
          properties: {
            beginDate: {
              type: 'object',
              title: '',
              properties: { calendarDate: { type: 'string', format: 'date', title: 'Begin' } }
            },
            endDate: {
              type: 'object',
              title: '',
              properties: { calendarDate: { type: 'string', format: 'date', title: 'End' } }
            }
          }
        },

      },
      properties: {
        temporalCoverage: {
          oneOf: [
            { "$ref": "#/properties/temporalCoverage/definitions/singleDateTimeNested" },
            { "$ref": "#/properties/temporalCoverage/definitions/rangeOfDates" },
            { "$ref": "#/properties/additionalMetadata/properties/formationPeriod" },
            { "$ref": "#/properties/additionalMetadata/properties/livingTimePeriod" }
          ]
        }
      }
    },*/
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
    temporalCoverages: {
      type: 'array',
      title: 'Temporal Coverage',
      items: {
        type: 'object',
        required: ['type'],
        properties: {
          type: {
            type: 'string',
            enum: ['DATE_RANGE', 'SINGLE_DATE', 'FORMATION_PERIOD', 'LIVING_TIME_PERIOD'],
            title: 'Coverage type'
          },
          startDate: { type: 'string', format: 'date', title: 'Start date' },
          endDate: { type: 'string', format: 'date', title: 'End date' },
          formationPeriod: { type: 'string', title: 'Formation period' },
          livingTimePeriod: { type: 'string', title: 'Living time period' }
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
    methodStep: { type: 'array', items: { type: 'object', properties: { description: { type: 'string'} } } },
    studyExtent: { type: 'string'},
    samplingDescription: { type: 'string'},
    qualityControl: { type: 'string'},
    //citation: { type: 'string' },
    //citation__identifier: { type: 'string' },
    bibliography: { type: 'array', items: {
      type: 'object',
      properties: {
        citation: { type: 'string'},
        citation__identifier: { type: 'string' }
      },
      required: ['citation', 'citation__identifier']
    } },
    collection: {
      type: 'array',
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

export default schema;
