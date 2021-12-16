import emlTemplate from './eml-blank.xml.js';

const Seek = (nodeKey, nodeValue, parentNode) => {
  var node = parentNode.querySelector(nodeKey);

  if (typeof nodeValue == 'string') {
    node.innerHTML = nodeValue;
  }
  else if (Array.isArray(nodeValue)) {
    const emptyNodeTemplate = node.cloneNode(true);

    for (const [k, v] of Object.entries(nodeValue)) {
      if (k != '0') { // Make new nodes for many to one
        const newSiblingNode = (emptyNodeTemplate.cloneNode(true) as HTMLElement);
        node = node.parentNode.insertBefore(newSiblingNode, node.nextSibling);
      }
      for (const [label, item] of Object.entries(v)) {
        Seek(label, item, node);
      }
    }
  }
  else if (typeof nodeValue == 'object') {
    for (const [k, v] of Object.entries(nodeValue)) {
      var newNode = node.querySelector(k);
      if (newNode) { Seek(k, v, newNode.parentNode); }
    }
  }
}

const MakePopulatedEML = (jsonformsData) => {
  const parser = new DOMParser();
  var emlDoc = parser.parseFromString(emlTemplate, "text/xml");
  console.log(jsonformsData);

  for (const [fieldKey, fieldValue] of Object.entries(jsonformsData)) {
    console.log('starting');
    Seek(fieldKey, fieldValue, emlDoc.querySelector('eml'));
  }

  /*
  var datasetNode = emlDoc.querySelector('eml>dataset');
  console.log(jsonformsData);

  for (const [fieldKey, fieldValue] of Object.entries(jsonformsData)) {
    var node = emlDoc.querySelector('eml ' + fieldKey);
    if (Array.isArray(fieldValue)) {
      // There may be multiple e.g. creator nodes in the eml. The blank template
      // has 1 single example for each of these. So we keep an empty clone
      // of it here, and make more clones from this one if required, as later on it will get populated
      var nodeTemplate = node!.cloneNode(true);

      for (var [k, v] of Object.entries(fieldValue!)) {
        // See previous comment; Creator 1 uses the already existing node, creator 2, 3, 4, etc needs a clone
        if (k != '0') {
          node = (nodeTemplate.cloneNode(true) as HTMLElement);
          datasetNode!.appendChild(node);
        }

        // Fill in creator.givenName, etc
        for (var [label, item] of Object.entries(v)) {
          var subNode = node!.querySelector(label);
          if (subNode) { subNode.innerHTML = String(item) || ''; }
        }
      }
    }
    else if(typeof fieldValue == 'object' && fieldValue != null) {
      // This is for nested objects like <coverage><geographicCoverage>
      for (const [label, item] of Object.entries(fieldValue)) {
        var subNode = node!.querySelector(label);
        if (subNode) { subNode.innerHTML = String(item) || ''; }
      }
    }
    else {
      node!.innerHTML = String(fieldValue) || '';
    }
  }*/

  var XMLS = new XMLSerializer();
  var inp_xmls = XMLS.serializeToString(emlDoc);
  console.log(inp_xmls);
  return '<?xml version="1.0" encoding="UTF-8"?>' + inp_xmls;
};

export default MakePopulatedEML;
