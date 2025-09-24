import { useMemo, useState, useCallback, ChangeEvent } from 'react';
import TextField from '@mui/material/TextField';
import merge from 'lodash/merge';
import type { ControlProps, RankedTester } from '@jsonforms/core';
import {
  isStringControl,
  isDescriptionHidden,
  rankWith
} from '@jsonforms/core';
import { withJsonFormsControlProps } from '@jsonforms/react';

const normalizeValue = (value: string): string | undefined => {
  if (value.trim().length === 0) {
    return undefined;
  }

  return value;
};

const BaseTouchedTextControl = (props: ControlProps) => {
  const {
    data,
    description,
    enabled,
    errors,
    handleChange,
    id,
    label,
    path,
    required,
    schema,
    uischema,
    visible,
    config
  } = props;

  const appliedOptions = useMemo(
    () => merge({}, config, uischema.options),
    [config, uischema.options]
  );

  const [focused, setFocused] = useState(false);
  const [touched, setTouched] = useState(
    () => data !== undefined && data !== null && `${data}`.length > 0
  );

  const inputValue = typeof data === 'string' ? data : data ?? '';
  const normalisedValue = normalizeValue(inputValue);
  const missingRequired = required && normalisedValue === undefined;

  const errorList = errors
    ? errors
        .split('\n')
        .map((entry) => entry.trim())
        .filter((entry) => entry.length > 0)
    : [];
  const nonRequiredErrors = errorList.filter(
    (entry) =>
      entry.length > 0 &&
      !entry.includes("must have required property") &&
      !entry.includes('must NOT have fewer than')
  );
  const externalError = nonRequiredErrors[0] ?? '';
  const showError = touched && (missingRequired || nonRequiredErrors.length > 0);
  const showDescription = !isDescriptionHidden(
    visible,
    description,
    focused,
    appliedOptions.showUnfocusedDescription
  );
  const hideForRequired = showError && missingRequired;
  const helperText = showError
    ? hideForRequired
      ? ' '
      : externalError
    : showDescription
      ? description
      : ' ';

  const maxLength = schema?.maxLength;

  const inputProps = useMemo(() => {
    const baseProps: Record<string, unknown> = {};

    if (appliedOptions.restrict && maxLength !== undefined) {
      baseProps.maxLength = maxLength;
    }

    if (appliedOptions.trim && maxLength !== undefined) {
      baseProps.size = maxLength;
    }

    if (appliedOptions.autocomplete) {
      baseProps.autoComplete = appliedOptions.autocomplete;
    }

    if (appliedOptions.readOnly) {
      baseProps.readOnly = true;
    }

    if (appliedOptions.muiInputProps) {
      return { ...baseProps, ...appliedOptions.muiInputProps };
    }

    return baseProps;
  }, [appliedOptions, maxLength]);

  const handleValueChange = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = normalizeValue(event.target.value);
      handleChange(path, value);
    },
    [handleChange, path]
  );

  const handleFocus = useCallback(() => {
    setFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setFocused(false);
    setTouched(true);
  }, []);

  if (!visible) {
    return null;
  }

  const type =
    appliedOptions.format === 'password' || schema?.format === 'password'
      ? 'password'
      : 'text';

  const fullWidth = !appliedOptions.trim;

  const minRows =
    appliedOptions.multi ? appliedOptions.minRows ?? 3 : undefined;

  const baseLabel =
    typeof label === 'string' ? label.replace(/\s*\*$/, '') : label;
  const displayLabel =
    typeof baseLabel === 'string' && required ? `${baseLabel}*` : label;

  return (
    <TextField
      autoFocus={appliedOptions.focus}
      disabled={!enabled}
      error={showError}
      fullWidth={fullWidth}
      helperText={helperText}
      id={id}
      inputProps={inputProps}
      label={displayLabel}
      margin='normal'
      minRows={minRows}
      multiline={Boolean(appliedOptions.multi)}
      onBlur={handleBlur}
      onChange={handleValueChange}
      onFocus={handleFocus}
      placeholder={appliedOptions.placeholder}
      required={false}
      type={type}
      value={inputValue}
      InputLabelProps={
        showError
          ? {
              required: false,
              sx: {
                color: 'error.main',
                '& .MuiFormLabel-asterisk': {
                  color: 'error.main',
                },
              },
            }
          : { required: false }
      }
    />
  );
};

export const touchedTextControlTester: RankedTester = rankWith(100, isStringControl);

export default withJsonFormsControlProps(BaseTouchedTextControl);
