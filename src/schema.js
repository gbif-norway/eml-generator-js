var schema = {
  type: 'object',
  properties: {
    title: { type: 'string', title: 'Dataset title' },
    abstract: { type: 'string', title: 'Description', description: 'A brief overview of the resource that is being documented broken into paragraphs.' },
    creator: {
      type: 'array',
      title: 'Creator(s) - ',
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
      title: 'Contact(s)',
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
      title: 'Metadata Provider(s)',
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
      title: 'Associated person(s)',
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
    geographicCoverage: {
      type: 'object',
      properties: {
        westBoundingCoordinate:   { type: 'string', title: 'West' },
        eastBoundingCoordinate:   { type: 'string', title: 'East' },
        northBoundingCoordinate:  { type: 'string', title: 'North' },
        southBoundingCoordinate:  { type: 'string', title: 'South' }
      }
    },
    taxonomicCoverage: {
      type: 'object',
      properties: {
        generalTaxonomicCoverage: { type: 'string' }
      }
    }
  },
  required: ['title', 'abstract', 'creator', 'contact']
};

export default schema;
