import { Fragment, useCallback, useMemo, useState } from 'react';
import { JsonForms } from '@jsonforms/react';
import Grid from '@mui/material/Grid';
import type { Theme } from '@mui/material/styles';
import './App.css';
import schema from './schema.js';
import uischema from './uischema.js';
import {
  materialCells,
  materialRenderers,
} from '@jsonforms/material-renderers';
import RatingControl from './RatingControl';
import ratingControlTester from './ratingControlTester';
import { makeStyles } from '@mui/styles';
import MakeEMLButton from './MakeEMLButton';
import initialDataSeed from './initialData.js';
import type { JsonRecord } from './MakePopulatedEML';
import TouchedTextControl, { touchedTextControlTester } from './TouchedTextControl';
import QuietArrayControl, { quietArrayControlTester } from './QuietArrayControl';
import LockedCategorizationStepper, { lockedCategorizationStepperTester } from './LockedCategorizationStepper';
import type { ErrorObject } from 'ajv';
import TemporalCoverageControl, { temporalCoverageControlTester } from './TemporalCoverageControl';


const useStyles = makeStyles((_theme: Theme) => ({
  container: {
    padding: '0em 4em 1em 4em',
    width: '100%',
  },
  title: {
    textAlign: 'center',
    padding: '0.25em',
  },
  dataContent: {
    display: 'flex',
    justifyContent: 'center',
    borderRadius: '0.25em',
    backgroundColor: '#cecece',
    marginBottom: '1rem',
  },
  resetButton: {
    margin: 'auto',
    display: 'block',
  },
  demoform: {
    margin: 'auto',
    padding: '1rem',
  }
}));

const initialData = initialDataSeed;

const renderers = [
  ...materialRenderers,
  //register custom renderers
  { tester: lockedCategorizationStepperTester, renderer: LockedCategorizationStepper },
  { tester: ratingControlTester, renderer: RatingControl },
  { tester: touchedTextControlTester, renderer: TouchedTextControl },
  { tester: quietArrayControlTester, renderer: QuietArrayControl },
  { tester: temporalCoverageControlTester, renderer: TemporalCoverageControl },
];

const App = () => {
  const classes = useStyles();
  const [jsonformsData, setJsonformsData] = useState<JsonRecord>(initialData as JsonRecord);

  const translateError = useCallback((error: ErrorObject): string => {
    switch (error.keyword) {
      case 'required':
      case 'minItems':
        (error as ErrorObject & { message: string }).message = '';
        return '';
      case 'format':
        if (error.params && 'format' in error.params && error.params.format === 'email') {
          return 'Enter a valid email address';
        }
        return 'Invalid format';
      default:
        return error.message ?? 'Invalid';
    }
  }, []);

  const jsonFormsI18n = useMemo(
    () => ({
      locale: 'en',
      translate: (_id: string, defaultMessage?: string) => defaultMessage ?? '',
      translateError,
    }),
    [translateError]
  );

  return (
    <Fragment>
      <div className='App'>
        <header className='App-header'>
          <h1 className='App-title'>
            EML generator
          </h1>
          <p className='App-intro'>Fill in metadata in English. More detail = better findability = more citations.</p>
        </header>
      </div>

      <Grid
        container
        justifyContent={'center'}
        spacing={1}
        className={classes.container}
      >
        <Grid item sm={12}>
          <div className={classes.demoform}>
            <JsonForms
              schema={schema}
              uischema={uischema}
              data={jsonformsData}
              renderers={renderers}
              cells={materialCells}
              i18n={jsonFormsI18n}
              onChange={({ data }) => setJsonformsData((data ?? {}) as JsonRecord)}
            />
          </div>
          <MakeEMLButton jsonformsData={jsonformsData} />
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default App;
