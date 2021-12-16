import emlTemplate from './eml-blank.xml.js';

const MakePopulatedEML = (jsonformsData) => {
  const parser = new DOMParser();
  var emlDoc = parser.parseFromString(emlTemplate, "text/xml");

  var datasetNode = emlDoc.querySelector('eml>dataset');

  for (const [fieldKey, fieldValue] of Object.entries(jsonformsData)) {
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
  return '<?xml version="1.0" encoding="UTF-8"?>' + inp_xmls;
};

export default MakePopulatedEML;
