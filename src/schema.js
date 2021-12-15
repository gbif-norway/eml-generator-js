var schema = {
  type: 'object',
  properties: {
    title: { type: 'string', title: 'Dataset title' },
    abstract: { type: 'string', title: 'Description', description: 'A brief overview of the resource that is being documented broken into paragraphs.' },
    creator: {
      type: 'array',
      title: 'Creator(s) - those who created the resource, in priority order.',
      items: {
        type: 'object',
        properties: {
          givenName:              { type: 'string', title: 'First name' },
          surName:                { type: 'string', title: 'Surname' },
          electronicMailAddress:  { type: 'string', title: 'Email' },
          //phone:                  { type: 'string' },
          positionName:           { type: 'string' },
          organizationName:       { type: 'string' },
          //deliveryPoint:          { type: 'string', title: 'Address' },
          city:                   { type: 'string' },
          //administrativeArea:     { type: 'string', title: 'State/Province' },
          country:                { type: 'string', description: 'Countries, territories, and islands are based on the ISO 3166-1 standard.'},
          //postalCode:             { type: 'string' },
          //onlineUrl:              { type: 'string', title: 'Home Page' },
          //userId__directory:      { type: 'string' },
          userId:                 { type: 'string', title: 'ORCID' }
        }
      }
    },
    contact: {
      type: 'array',
      title: 'Contact(s) - curators of the resource who should be contacted for more information or to fix data problems.',
      items: {
        type: 'object',
        properties: {
          givenName:              { type: 'string', title: 'First name' },
          surName:                { type: 'string', title: 'Surname' },
          electronicMailAddress:  { type: 'string', title: 'Email' },
          positionName:           { type: 'string', title: 'Position' },
          organizationName:       { type: 'string', title: 'Organisation' },
          city:                   { type: 'string' },
          country:                { type: 'string', description: 'Countries, territories, and islands are based on the ISO 3166-1 standard.'},
          userId:                 { type: 'string', title: 'ORCID' }
        }
      }
    },
    metadataProvider: {
      type: 'array',
      title: 'Metadata Provider(s) - those responsible for producing the resource metadata.',
      items: {
        type: 'object',
        properties: {
          givenName:              { type: 'string', title: 'First name' },
          surName:                { type: 'string', title: 'Surname' },
          electronicMailAddress:  { type: 'string', title: 'Email' },
          positionName:           { type: 'string', title: 'Position' },
          organizationName:       { type: 'string', title: 'Organisation' },
          city:                   { type: 'string' },
          country:                { type: 'string', description: 'Countries, territories, and islands are based on the ISO 3166-1 standard.'},
          userId:                 { type: 'string', title: 'ORCID' }
        }
      }
    },
    associatedParty: {
      type: 'array',
      title: 'Associated person(s) - others associated with the resource.',
      items: {
        type: 'object',
        properties: {
          givenName:              { type: 'string', title: 'First name' },
          surName:                { type: 'string', title: 'Surname' },
          electronicMailAddress:  { type: 'string', title: 'Email' },
          positionName:           { type: 'string', title: 'Position' },
          organizationName:       { type: 'string', title: 'Organisation' },
          city:                   { type: 'string' },
          country:                { type: 'string', description: 'Countries, territories, and islands are based on the ISO 3166-1 standard.'},
          userId:                 { type: 'string', title: 'ORCID' }
        }
      }
    },
    coverage: {
      type: 'object',
      properties: {
        geographicCoverage: {
          type: 'object',
          properties: {
            westBoundingCoordinate:   { type: 'string', title: 'West' },
            eastBoundingCoordinate:   { type: 'string', title: 'East' },
            northBoundingCoordinate:  { type: 'string', title: 'North' },
            southBoundingCoordinate:  { type: 'string', title: 'South' }
          }
        }
      }
    },
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
    temporalCoverage: {
      type: 'object',
      properties: {
        singleDateTime:   { type: 'string', format: 'date', title: 'Single date' },
        rangeOfDates:   {
          type: 'object',
          properties: {
            beginDate: { type: 'string', format: 'date' },
            endDate: { type: 'string', format: 'date' },
          }
        }
      }
    },
    additionalMetadata: {
      type: 'object',
      properties: {
        formationPeriod: { type: 'string' },
        livingTimePeriod: { type: 'string' }
      }
    }
  },
  required: ['title', 'abstract', 'creator', 'contact']
};

export default schema;
