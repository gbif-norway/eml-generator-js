import { Fragment, useState } from 'react';
import { JsonForms } from '@jsonforms/react';
import Grid from '@material-ui/core/Grid';
import './App.css';
import schema from './schema.js';
import uischema from './uischema.js';
import {
  materialCells,
  materialRenderers,
} from '@jsonforms/material-renderers';
import RatingControl from './RatingControl';
import ratingControlTester from './ratingControlTester';
import { makeStyles } from '@material-ui/core/styles';
import MakeEMLButton from './MakeEMLButton';
import initialDataSeed from './initialData.js';
import ReactGA from 'react-ga';
ReactGA.initialize('UA-165033400-8', {
  debug: true,
  gaOptions: { cookieFlags: "SameSite=None; Secure" }
});
ReactGA.pageview(window.location.pathname + window.location.search);

const useStyles = makeStyles((_theme) => ({
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
  { tester: ratingControlTester, renderer: RatingControl },
];

const App = () => {
  const classes = useStyles();
  const [jsonformsData, setJsonformsData] = useState<any>(initialData);

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
        justify={'center'}
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
              onChange={({ errors, data }) => setJsonformsData(data)}
            />
          </div>
          <MakeEMLButton jsonformsData={jsonformsData} />
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default App;
