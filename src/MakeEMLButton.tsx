import React from "react";
import Button from '@material-ui/core/Button';
import MakePopulatedEML from './MakePopulatedEML';
import Archive from '@material-ui/icons/Archive';

interface Props {
  jsonformsData: object;
}

const MakeEMLButton: React.FC<Props> = ({ jsonformsData }) => {
  const downloadEML = () => {
    const element = document.createElement("a");
    const file = new Blob([MakePopulatedEML(jsonformsData)], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "eml.xml";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  return (
    <div className="download">
      <Button onClick={downloadEML} color='secondary' variant='contained' className='downloadButton' endIcon={<Archive />}>
        Download EML
      </Button>
      <p>This form is in beta and needs testing. If your EML does not load into the IPT, or if something in the form does not work, please provide feedback on <a href="https://github.com/gbif-norway/eml-generator-js/issues">github</a> or via <a href="mailto:helpdesk@gbif.no">email</a>.</p>
    </div>
  );
}

export default MakeEMLButton;
