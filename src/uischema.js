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
          { type: 'Control', scope: '#/properties/singleDateTime/properties/calendarDate' },
          { type: 'Group', label: 'Date range', elements: [
            {type: 'Control', scope: '#/properties/rangeOfDates/properties/beginDate/properties/calendarDate' },
            {type: 'Control', scope: '#/properties/rangeOfDates/properties/endDate/properties/calendarDate' }
          ]},
          { type: 'Control', scope: '#/properties/additionalMetadata/properties/formationPeriod' },
          { type: 'Control', scope: '#/properties/additionalMetadata/properties/livingTimePeriod' }
        ]}
      ]}
    ]},
    { type: 'Category', label: 'Project data', elements: [
      { type: 'Control', scope: '#/properties/project' },
      { type: 'ListWithDetail', scope: '#/properties/keywordSet' }
      //{ type: 'HorizontalLayout', elements: [{ type: 'Control', scope: '#/properties/keywordSet' }] },
    ]},
    { type: 'Category', label: 'Sampling methods', elements: [
      { type: 'Control', scope: '#/properties/studyExtent' },
      { type: 'Control', scope: '#/properties/samplingDescription' },
      { type: 'Control', scope: '#/properties/qualityControl' },
      { type: 'Control', scope: '#/properties/methodStep' }
    ] },
    { type: 'Category', label: 'Citations', elements: [
      { type: 'Control', scope: '#/properties/citation', options: { multi: true } },
      { type: 'Control', scope: '#/properties/citation__identifier' },
      { type: 'HorizontalLayout', elements: [{ type: 'Control', scope: '#/properties/bibliography' }] }
    ] },
    { type: 'Category', label: 'Collection data', elements: [
      { type: 'Control', scope: '#/properties/collection' },
      { type: 'Control', scope: '#/properties/specimenPreservationMethod' },
      { type: 'Control', scope: '#/properties/jgtiCuratorialUnit' },
    ] },
    { type: 'Category', label: 'External links', elements: [
      { type: 'Control', scope: '#/properties/online/properties/url' },
      { type: 'Control', scope: '#/properties/physical' },
    ] },
    { type: 'Category', label: 'Additional metadata', elements: [
      { type: 'Control', scope: '#/properties/purpose' },
      { type: 'Control', scope: '#/properties/maintenance/properties/description' },
      { type: 'Control', scope: '#/properties/additionalInfo' },
      { type: 'Control', scope: '#/properties/alternateIdentifier' }
    ] }
  ],
  options: {
    variant: 'stepper',
    showNavButtons: true
  }
}

export default uischema;
