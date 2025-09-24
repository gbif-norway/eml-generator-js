import React, { useMemo, useState } from 'react';
import merge from 'lodash/merge';
import { Button, Grid, Step, StepButton, Stepper } from '@mui/material';
import type Ajv from 'ajv';
import {
  and,
  Categorization,
  categorizationHasCategory,
  Category,
  deriveLabelForUISchemaElement,
  getAjv,
  isVisible,
  optionIs,
  RankedTester,
  rankWith,
  StatePropsOfLayout,
  uiTypeIs,
  JsonFormsCellRendererRegistryEntry,
  JsonFormsRendererRegistryEntry,
  JsonSchema,
  UISchemaElement,
  OwnPropsOfRenderer,
} from '@jsonforms/core';
import {
  JsonFormsDispatch,
  TranslateProps,
  useJsonForms,
  withJsonFormsLayoutProps,
  withTranslateProps,
} from '@jsonforms/react';

export const lockedCategorizationStepperTester: RankedTester = rankWith(
  1000,
  and(
    uiTypeIs('Categorization'),
    categorizationHasCategory,
    optionIs('variant', 'stepper')
  )
);

interface AjvProps {
  ajv: Ajv;
}

interface MaterialLayoutRendererProps extends OwnPropsOfRenderer {
  elements: UISchemaElement[];
  direction: 'row' | 'column';
}

const renderLayoutElements = (
  elements: UISchemaElement[] = [],
  schema: JsonSchema,
  path: string,
  enabled: boolean,
  renderers?: JsonFormsRendererRegistryEntry[],
  cells?: JsonFormsCellRendererRegistryEntry[]
) =>
  elements.map((child, index) => (
    <Grid item key={`${path}-${index}`} xs>
      <JsonFormsDispatch
        uischema={child}
        schema={schema}
        path={path}
        enabled={enabled}
        renderers={renderers}
        cells={cells}
      />
    </Grid>
  ));

const MaterialLayoutRenderer = React.memo(
  ({
    visible,
    elements,
    schema,
    path,
    enabled,
    direction,
    renderers,
    cells,
  }: MaterialLayoutRendererProps) => {
    if (!visible || !elements?.length) {
      return null;
    }

    return (
      <Grid
        container
        direction={direction}
        spacing={direction === 'row' ? 2 : 0}
      >
        {renderLayoutElements(
          elements,
          schema ?? ({} as JsonSchema),
          path ?? '',
          enabled ?? true,
          renderers,
          cells
        )}
      </Grid>
    );
  }
);

const withAjvProps = <P extends object>(Component: React.ComponentType<AjvProps & P>) =>
  function WithAjvProps(props: P) {
    const ctx = useJsonForms();
    const ajv = getAjv({ jsonforms: { ...ctx } });
    return <Component {...props} ajv={ajv} />;
  };

interface LockedCategorizationProps
  extends StatePropsOfLayout,
    AjvProps,
    TranslateProps {
  data: any;
}

const isNonEmptyString = (value: unknown): boolean =>
  typeof value === 'string' && value.trim().length > 0;

const hasValidResourceContact = (value: unknown): boolean => {
  if (!Array.isArray(value)) {
    return false;
  }

  return value.some((entry) => {
    if (!entry || typeof entry !== 'object') {
      return false;
    }

    const record = entry as Record<string, unknown>;
    return (
      isNonEmptyString(record.surName) &&
      isNonEmptyString(record.electronicMailAddress)
    );
  });
};

export const LockedCategorizationStepper: React.FC<LockedCategorizationProps> = (
  props
) => {
  const [activeCategory, setActiveCategory] = useState<number>(0);
  const {
    data,
    path,
    renderers,
    schema,
    uischema,
    visible,
    cells,
    config,
    ajv,
    t,
  } = props;

  const categorization = uischema as Categorization;
  const appliedUiSchemaOptions = merge({}, config, uischema.options);

  const categories = useMemo(() => {
    return categorization.elements.filter(
      (category): category is Category => category.type === 'Category'
    );
  }, [categorization]);

  const visibleCategories = useMemo(
    () =>
      categories.filter((category) =>
        isVisible(category, data, path ?? '', ajv)
      ),
    [categories, data, path, ajv]
  );

  const childProps: MaterialLayoutRendererProps = {
    elements: visibleCategories[activeCategory]?.elements ?? [],
    schema: schema ?? ({} as JsonSchema),
    path: path ?? '',
    direction: 'column',
    visible,
    renderers,
    cells,
  };

  const tabLabels = useMemo(
    () =>
      visibleCategories.map((category) =>
        deriveLabelForUISchemaElement(category, t)
      ),
    [visibleCategories, t]
  );

  const basicComplete =
    isNonEmptyString(data?.title) &&
    isNonEmptyString(data?.abstract) &&
    hasValidResourceContact(data?.resourceContact);

  const handleStep = (step: number) => {
    if (step === activeCategory) {
      return;
    }

    if (step > activeCategory && !basicComplete) {
      return;
    }

    setActiveCategory(step);
  };

  if (!visible) {
    return null;
  }

  return (
    <>
      <Stepper activeStep={activeCategory} nonLinear>
        {visibleCategories.map((category, idx) => (
          <Step
            key={tabLabels[idx] ?? idx}
            disabled={idx > 0 && !basicComplete}
          >
            <StepButton
              onClick={() => handleStep(idx)}
              disabled={idx > 0 && !basicComplete}
            >
              {tabLabels[idx]}
            </StepButton>
          </Step>
        ))}
      </Stepper>
      <div>
        <MaterialLayoutRenderer {...childProps} />
      </div>
      {appliedUiSchemaOptions.showNavButtons && (
        <div style={{ textAlign: 'right', width: '100%', margin: '1em auto' }}>
          <Button
            style={{ float: 'right' }}
            variant='contained'
            color='primary'
            disabled={
              activeCategory >= visibleCategories.length - 1 ||
              (!basicComplete && activeCategory === 0)
            }
            onClick={() => handleStep(activeCategory + 1)}
          >
            Next
          </Button>
          <Button
            style={{ marginRight: '1em' }}
            color='secondary'
            variant='contained'
            disabled={activeCategory <= 0}
            onClick={() => handleStep(activeCategory - 1)}
          >
            Previous
          </Button>
        </div>
      )}
    </>
  );
};

export default withAjvProps(
  withTranslateProps(withJsonFormsLayoutProps(LockedCategorizationStepper))
);
