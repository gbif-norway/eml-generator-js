import { Fragment, useState, useEffect } from 'react';
import { JsonForms } from '@jsonforms/react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import logo from './logo.svg';
import './App.css';
import schema from './schema.json';
import uischema from './uischema.json';
import {
  materialCells,
  materialRenderers,
} from '@jsonforms/material-renderers';
import RatingControl from './RatingControl';
import ratingControlTester from './ratingControlTester';
import { makeStyles } from '@material-ui/core/styles';
import emlTemplate from './eml-blank.xml.js';

const useStyles = makeStyles((_theme) => ({
  container: {
    padding: '1em',
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
  },
}));

const initialData = {};

const renderers = [
  ...materialRenderers,
  //register custom renderers
  { tester: ratingControlTester, renderer: RatingControl },
];

const App = () => {
  const classes = useStyles();
  const [displayDataAsString, setDisplayDataAsString] = useState('');
  const [jsonformsData, setJsonformsData] = useState<any>(initialData);

  useEffect(() => {
    setDisplayDataAsString(JSON.stringify(jsonformsData, null, 2));
  }, [jsonformsData]);


  const getPopulatedEmlTemplate = () => {
    const parser = new DOMParser();
    var emlDoc = parser.parseFromString(emlTemplate, "text/xml");

    for (const [fieldKey, fieldValue] of Object.entries(jsonformsData)) {
      var datasetNode = emlDoc.querySelector('eml>dataset');
      var node = emlDoc.querySelector('eml>dataset>' + fieldKey);

      if (node && datasetNode) {
        if (Array.isArray(fieldValue)) {
          // There may be multiple e.g. creator nodes in the eml. The blank template
          // has 1 single example for each of these. So we keep an empty clone
          // of it here, and make more clones from this one if required, as later on it will get populated
          var nodeTemplate = node.cloneNode(true);

          for (var [k, v] of Object.entries(fieldValue)) {
            // See previous comment; Creator 1 uses the template node, creator 2, 3, 4, etc needs a clone
            if (k != '0') {
              node = (nodeTemplate.cloneNode(true) as HTMLElement);
              datasetNode.appendChild(node);
            }

            // Fill in creator.givenName, etc
            for (var [label, item] of Object.entries(v)) {
              var subNode = node.querySelector(label);
              if (subNode) { subNode.innerHTML = String(item) || ''; }
            }
          }
        } else {
          node.innerHTML = String(fieldValue) || '';
        }
      }
    }

    var XMLS = new XMLSerializer();
    var inp_xmls = XMLS.serializeToString(emlDoc);
    return inp_xmls;
  };

  const downloadEML = () => {
    const element = document.createElement("a");
    const file = new Blob([getPopulatedEmlTemplate()], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "eml.xml";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  return (
    <Fragment>
      <div className='App'>
        <header className='App-header'>
          <h1 className='App-title'>EML generator</h1>
          <p className='App-intro'>Fill in metadata in english. More detail = better findability = more citations.</p>
        </header>
      </div>

      <Grid
        container
        justify={'center'}
        spacing={1}
        className={classes.container}
      >
        <Grid item sm={11}>
          <Typography variant={'h3'} className={classes.title}>
            Rendered form
          </Typography>
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
        </Grid>
        <Grid item sm={1}>
          <Button
            className={classes.resetButton}
            onClick={downloadEML}
            color='primary'
            variant='contained'
          >
            Download EML
          </Button>
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default App;
