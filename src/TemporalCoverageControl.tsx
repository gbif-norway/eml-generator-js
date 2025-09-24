import { useMemo, useCallback } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import type {
  ControlElement,
  ControlProps,
  JsonSchema,
  RankedTester,
  TesterContext,
  UISchemaElement
} from '@jsonforms/core';
import { rankWith } from '@jsonforms/core';
import { withJsonFormsControlProps } from '@jsonforms/react';

const TEMPORAL_TYPES = [
  { value: 'DATE_RANGE', label: 'Date range' },
  { value: 'SINGLE_DATE', label: 'Single date' },
  { value: 'FORMATION_PERIOD', label: 'Formation period' },
  { value: 'LIVING_TIME_PERIOD', label: 'Living time period' }
];

type TemporalEntry = {
  type?: string;
  startDate?: string;
  endDate?: string;
  formationPeriod?: string;
  livingTimePeriod?: string;
};

const normaliseValue = (value: string): string | undefined => (value.trim().length ? value : undefined);

const ensureArray = (data: unknown): TemporalEntry[] => (
  Array.isArray(data)
    ? data.filter((item): item is TemporalEntry => Boolean(item) && typeof item === 'object')
    : []
);

const entryForType = (entry: TemporalEntry, type: string): TemporalEntry => {
  switch (type) {
    case 'DATE_RANGE':
      return {
        type,
        startDate: entry.startDate,
        endDate: entry.endDate
      };
    case 'SINGLE_DATE':
      return {
        type,
        startDate: entry.startDate
      };
    case 'FORMATION_PERIOD':
      return {
        type,
        formationPeriod: entry.formationPeriod
      };
    case 'LIVING_TIME_PERIOD':
      return {
        type,
        livingTimePeriod: entry.livingTimePeriod
      };
    default:
      return { type };
  }
};

const BaseTemporalCoverageControl = (props: ControlProps) => {
  const {
    data,
    description,
    enabled,
    errors,
    handleChange,
    label,
    path,
    required,
    visible
  } = props;

  const entries = ensureArray(data);

  const updateEntries = useCallback((next: TemporalEntry[]) => {
    handleChange(path, next.length ? next : undefined);
  }, [handleChange, path]);

  const addEntry = useCallback(() => {
    updateEntries([...entries, { type: 'DATE_RANGE' }]);
  }, [entries, updateEntries]);

  const removeEntry = useCallback((index: number) => {
    const next = entries.filter((_, itemIndex) => itemIndex !== index);
    updateEntries(next);
  }, [entries, updateEntries]);

  const changeEntry = useCallback((index: number, updates: Partial<TemporalEntry>) => {
    const next = entries.map((entry, itemIndex) => (
      itemIndex === index
        ? { ...entry, ...updates }
        : entry
    ));
    updateEntries(next);
  }, [entries, updateEntries]);

  const changeEntryType = useCallback((index: number, type: string) => {
    const revised = entryForType(entries[index] ?? {}, type);
    const next = entries.map((entry, itemIndex) => (
      itemIndex === index ? revised : entry
    ));
    updateEntries(next);
  }, [entries, updateEntries]);

  const title = useMemo(() => {
    if (!label) {
      return required ? 'Temporal coverage*' : 'Temporal coverage';
    }

    return required && typeof label === 'string' && !label.endsWith('*')
      ? `${label}*`
      : label;
  }, [label, required]);

  if (!visible) {
    return null;
  }

  const hasEntries = entries.length > 0;

  return (
    <Box>
      {title && (
        <Typography variant='h6' component='h3' gutterBottom>
          {title}
        </Typography>
      )}
      {description && (
        <Typography variant='body2' color='text.secondary' gutterBottom>
          {description}
        </Typography>
      )}

      {hasEntries ? (
        <Stack spacing={2} sx={{ mb: 2 }}>
          {entries.map((entry, index) => {
            const type = entry.type ?? '';
            const startValue = entry.startDate ?? '';
            const endValue = entry.endDate ?? '';
            const formationValue = entry.formationPeriod ?? '';
            const livingValue = entry.livingTimePeriod ?? '';

            return (
              <Paper elevation={0} variant='outlined' sx={{ p: 2 }} key={`temporal-${index}`}>
                <Stack spacing={2}>
                  <Box display='flex' flexWrap='wrap' gap={2}>
                    <TextField
                      select
                      label='Coverage type'
                      value={type}
                      onChange={(event) => changeEntryType(index, event.target.value)}
                      disabled={!enabled}
                      sx={{ minWidth: 220 }}
                    >
                      {TEMPORAL_TYPES.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                    <Box flexGrow={1} />
                    <Button
                      onClick={() => removeEntry(index)}
                      disabled={!enabled}
                    >
                      Remove
                    </Button>
                  </Box>

                  <Divider />

                  {type === 'DATE_RANGE' && (
                    <Box display='flex' flexWrap='wrap' gap={2}>
                      <TextField
                        type='date'
                        label='Start date'
                        value={startValue}
                        onChange={(event) =>
                          changeEntry(index, { startDate: normaliseValue(event.target.value) })
                        }
                        InputLabelProps={{ shrink: true }}
                        disabled={!enabled}
                        sx={{ minWidth: 200 }}
                      />
                      <TextField
                        type='date'
                        label='End date'
                        value={endValue}
                        onChange={(event) =>
                          changeEntry(index, { endDate: normaliseValue(event.target.value) })
                        }
                        InputLabelProps={{ shrink: true }}
                        disabled={!enabled}
                        sx={{ minWidth: 200 }}
                      />
                    </Box>
                  )}

                  {type === 'SINGLE_DATE' && (
                    <TextField
                      type='date'
                      label='Single date'
                      value={startValue}
                      onChange={(event) =>
                        changeEntry(index, { startDate: normaliseValue(event.target.value) })
                      }
                      InputLabelProps={{ shrink: true }}
                      disabled={!enabled}
                      sx={{ minWidth: 200 }}
                    />
                  )}

                  {type === 'FORMATION_PERIOD' && (
                    <TextField
                      label='Formation period'
                      value={formationValue}
                      onChange={(event) =>
                        changeEntry(index, { formationPeriod: normaliseValue(event.target.value) })
                      }
                      disabled={!enabled}
                      fullWidth
                    />
                  )}

                  {type === 'LIVING_TIME_PERIOD' && (
                    <TextField
                      label='Living time period'
                      value={livingValue}
                      onChange={(event) =>
                        changeEntry(index, { livingTimePeriod: normaliseValue(event.target.value) })
                      }
                      disabled={!enabled}
                      fullWidth
                    />
                  )}
                </Stack>
              </Paper>
            );
          })}
        </Stack>
      ) : (
        <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
          No temporal coverage entries added yet.
        </Typography>
      )}

      {errors && (
        <Typography color='error' variant='body2' sx={{ mb: 1 }}>
          {errors}
        </Typography>
      )}

      <Button onClick={addEntry} disabled={!enabled} variant='outlined'>
        Add temporal coverage
      </Button>
    </Box>
  );
};

const matchesTemporalCoverage = (
  uischema: UISchemaElement,
  _schema: JsonSchema,
  _context?: TesterContext
): boolean =>
  uischema.type === 'Control' &&
  (uischema as ControlElement).scope === '#/properties/temporalCoverages';

export const temporalCoverageControlTester: RankedTester = rankWith(
  1000,
  matchesTemporalCoverage
);

export default withJsonFormsControlProps(BaseTemporalCoverageControl);
