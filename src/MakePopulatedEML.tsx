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
  
  var XMLS = new XMLSerializer();
  var inp_xmls = XMLS.serializeToString(emlDoc);
  console.log(inp_xmls);
  return '<?xml version="1.0" encoding="UTF-8"?>' + inp_xmls;
};

export default MakePopulatedEML;
