import { ControlElement, JsonSchema, UISchemaElement } from '@jsonforms/core';
import { rankWith, RankedTester } from '@jsonforms/core';

export const geographicMapControlTester: RankedTester = rankWith(
  10,
  (uischema: UISchemaElement, schema: JsonSchema): boolean => {
    if (uischema.type !== 'Control') {
      return false;
    }
    
    const controlElement = uischema as ControlElement;
    const scope = controlElement.scope;
    
    // Check if this is for the geographicCoverage object
    return scope === '#/properties/geographicCoverage';
  }
);

