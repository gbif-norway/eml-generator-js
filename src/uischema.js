var uischema = {
  type: 'Categorization',
  elements: [
    { type: 'Category', label: 'Basic metadata', elements: [
      { type: 'VerticalLayout', elements: [
        { type: 'Control', scope: '#/properties/title' },
        { type: 'Control', scope: '#/properties/abstract', options: { multi: true } }
      ]},
      { type: 'HorizontalLayout', elements: [{ type: 'Control', scope: '#/properties/creator' }] },
      { type: 'HorizontalLayout', elements: [{ type: 'Control', scope: '#/properties/contact' }] },
      { type: 'HorizontalLayout', elements: [{ type: 'Control', scope: '#/properties/metadataProvider' }] },
      { type: 'HorizontalLayout', elements: [{ type: 'Control', scope: '#/properties/associatedParty' }] }
    ]},
    { type: 'Category', label: 'Coverage', elements: [
      { type: 'Group', label: 'Geographic Coverage', elements: [
        { type: 'HorizontalLayout', elements: [
          { type: 'Control', scope: '#/properties/geographicCoverage/properties/northBoundingCoordinate' },
          { type: 'Control', scope: '#/properties/geographicCoverage/properties/southBoundingCoordinate' },
          { type: 'Control', scope: '#/properties/geographicCoverage/properties/eastBoundingCoordinate' },
          { type: 'Control', scope: '#/properties/geographicCoverage/properties/westBoundingCoordinate' }
        ] }
      ]},
      { type: 'HorizontalLayout', elements: [ { type: 'Control', scope: '#/properties/taxonomicCoverage' }] },
      { type: 'Group', label: 'Temporal Coverage', elements: [
        { type: 'HorizontalLayout', elements: [
          { type: 'Control', scope: '#/properties/temporalCoverage/properties/singleDateTime' },
          { type: 'Group', label: 'Date range', elements: [
            {type: 'Control', scope: '#/properties/temporalCoverage/properties/rangeOfDates/properties/beginDate' },
            {type: 'Control', scope: '#/properties/temporalCoverage/properties/rangeOfDates/properties/endDate' }
          ]},
          { type: 'Control', scope: '#/properties/additionalMetadata/properties/formationPeriod' },
          { type: 'Control', scope: '#/properties/additionalMetadata/properties/livingTimePeriod' }
        ]}
      ]}
    ]},
    { type: 'Category', label: 'Keywords', elements: [] },
    { type: 'Category', label: 'Project data', elements: [] },
    { type: 'Category', label: 'Sampling methods', elements: [] },
    { type: 'Category', label: 'Citations', elements: [] },
    { type: 'Category', label: 'Collection data', elements: [] },
    { type: 'Category', label: 'External links', elements: [] },
    { type: 'Category', label: 'Additional metadata', elements: [] }
  ],
  options: {
    variant: 'stepper',
    showNavButtons: true
  }
}

export default uischema;
