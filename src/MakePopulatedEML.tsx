import emlTemplate from './eml-blank.xml.js';
import countries from './countries.js';

const Seek = (nodeKey, nodeValue, parentNode, identifier_attribute = '') => {
  var node = parentNode.querySelector(nodeKey);
  if (typeof nodeValue == 'string') {
    if(nodeKey == 'country') { nodeValue = countries[nodeValue]; };
    if(nodeKey == 'abstract') { // This needs to be improved
      nodeValue = '<para>' + nodeValue.split('\n').join('</para><para>') + '</para>';
    }
    node.innerHTML = nodeValue;
    if (identifier_attribute) { node.setAttribute('identifier', identifier_attribute); }
  }
  else if (Array.isArray(nodeValue)) {
    const emptyNodeTemplate = node.cloneNode(true);

    for (const [k, v] of Object.entries(nodeValue)) {
      if (k !== '0') { // Make new nodes for many to one
        const newSiblingNode = (emptyNodeTemplate.cloneNode(true) as HTMLElement);
        node = node.parentNode.insertBefore(newSiblingNode, node.nextSibling);
      }

      if (typeof v == 'string') { node.innerHTML = v; }
      else {
        const entries = Object.entries(v);

        // Special object with node attributes:
        if (entries.length == 2 && entries[1][0].includes('__identifier')) {
          Seek(entries[0][0], entries[0][1], node, String(entries[1][1]));
        }
        // Normal object
        else {
          for (const [label, item] of entries) {
            Seek(label, item, node);
          }
        }
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
    Seek(fieldKey, fieldValue, emlDoc.querySelector('eml'));
  }

  var XMLS = new XMLSerializer();
  var inp_xmls = XMLS.serializeToString(emlDoc);
  return inp_xmls.replace('<eml ', '<eml:eml ').replace('</eml', '</eml:eml');
};

export default MakePopulatedEML;
