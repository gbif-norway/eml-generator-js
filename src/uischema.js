var uischema = {
  type: "Categorization",
  elements: [
    { type: "Category", label: "Basic metadata", elements: [
      { type: "VerticalLayout", elements: [
        { type: "Control", scope: "#/properties/title" },
        { type: "Control", scope: "#/properties/abstract", options: { multi: true } }
      ]},
      { type: "HorizontalLayout", elements: [
        { type: "Control", scope: "#/properties/creator" }
      ]},
      { type: "HorizontalLayout", elements: [
        { type: "Control", scope: "#/properties/contact" }
      ]}
    ]},
    { type: "Category", label: "Coverage", elements: [
      { type: "HorizontalLayout", elements: [
        { type: "Control", scope: "#/properties/geographicCoverage" }
      ]},
      { type: "HorizontalLayout", elements: [
        { type: "Control", scope: "#/properties/taxonomicCoverage" }
      ]}
    ]},
    { type: "Category", label: "Keywords", elements: [] },
    { type: "Category", label: "Project data", elements: [] },
    { type: "Category", label: "Sampling methods", elements: [] },
    { type: "Category", label: "Citations", elements: [] },
    { type: "Category", label: "Collection data", elements: [] },
    { type: "Category", label: "External links", elements: [] },
    { type: "Category", label: "Additional metadata", elements: [] }
  ],
  options: {
    variant: "stepper",
    showNavButtons: true
  }
}

export default uischema;
