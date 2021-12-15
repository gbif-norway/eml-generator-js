import React from "react";
import Button from '@material-ui/core/Button';
import emlTemplate from './eml-blank.xml.js';

interface Props {
  jsonformsData: object;
}

const getPopulatedEmlTemplate = (jsonformsData) => {
  const parser = new DOMParser();
  var emlDoc = parser.parseFromString(emlTemplate, "text/xml");

  for (const [fieldKey, fieldValue] of Object.entries(jsonformsData)) {
    var datasetNode = emlDoc.querySelector('eml>dataset');
    var node = emlDoc.querySelector('eml>dataset>' + fieldKey);

    if (datasetNode && node && fieldValue) {
      if (Array.isArray(fieldValue)) {
        // There may be multiple e.g. creator nodes in the eml. The blank template
        // has 1 single example for each of these. So we keep an empty clone
        // of it here, and make more clones from this one if required, as later on it will get populated
        var nodeTemplate = node.cloneNode(true);

        for (var [k, v] of Object.entries(fieldValue)) {
          // See previous comment; Creator 1 uses the already existing node, creator 2, 3, 4, etc needs a clone
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

const MakeEMLButton: React.FC<Props> = ({
    jsonformsData
  }) => {

  const downloadEML = () => {
    const element = document.createElement("a");
    const file = new Blob([getPopulatedEmlTemplate(jsonformsData)], { type: 'text/plain' });
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
