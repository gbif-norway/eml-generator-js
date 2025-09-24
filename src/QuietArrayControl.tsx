import type {
  ArrayLayoutProps,
  RankedTester,
  ArrayTranslations,
  ControlElement,
  UISchemaElement,
  JsonSchema,
  TesterContext
} from '@jsonforms/core';
import type { ErrorObject } from 'ajv';
import { rankWith } from '@jsonforms/core';
import {
  withJsonFormsArrayLayoutProps,
  withTranslateProps,
  withArrayTranslationProps
} from '@jsonforms/react';
import { Unwrapped } from '@jsonforms/material-renderers';

const BaseQuietArrayControl = (props: ArrayLayoutProps & { translations: ArrayTranslations }) => {
  const { translations, path, ...rest } = props;
  const sanitisedProps = {
    ...rest,
    path,
    errors: '',
    childErrors: [] as ErrorObject[],
  };
  const wrapperClass =
    path === 'resourceContact'
      ? 'resource-contact-array'
      : path === 'associatedParty'
        ? 'associated-party-array'
        : undefined;
  return (
    <div className={wrapperClass}>
      <Unwrapped.MaterialArrayControlRenderer
        {...sanitisedProps}
        translations={translations}
      />
    </div>
  );
};

const matchesContactArray = (
  uischema: UISchemaElement,
  _schema: JsonSchema,
  _context?: TesterContext
): boolean =>
  uischema.type === 'Control' &&
  ['#/properties/resourceContact', '#/properties/associatedParty'].includes(
    (uischema as ControlElement).scope
  );

export const quietArrayControlTester: RankedTester = rankWith(
  1000,
  matchesContactArray
);

const quietArrayWithTranslations = withArrayTranslationProps(BaseQuietArrayControl);
const quietArrayWithI18n = withTranslateProps(quietArrayWithTranslations);

export default withJsonFormsArrayLayoutProps(quietArrayWithI18n);
