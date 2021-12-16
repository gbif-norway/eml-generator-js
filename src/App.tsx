import { Fragment } from 'react';
import { JsonForms } from '@jsonforms/react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import './App.css';
import MakeEMLButton from "./MakeEMLButton";


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

const initialData = {};

const renderers = [
  ...materialRenderers
];

const App = () => {
  const classes = useStyles();
  const [displayDataAsString, setDisplayDataAsString] = useState('');
  const [jsonformsData, setJsonformsData] = useState<any>(initialData);

  useEffect(() => {
    setDisplayDataAsString(JSON.stringify(jsonformsData, null, 2));
  }, [jsonformsData]);

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
