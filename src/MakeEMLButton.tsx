import React from "react";
import Button from '@mui/material/Button';
import MakePopulatedEML, { JsonRecord } from './MakePopulatedEML';

interface Props {
  jsonformsData: JsonRecord;
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
    <Button onClick={downloadEML} color='primary' variant='contained'>
      Download EML
    </Button>
  );
}

export default MakeEMLButton;
