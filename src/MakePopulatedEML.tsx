import emlTemplate from './eml-blank.xml.js';

const Seek = (nodeKey, nodeValue, parentNode) => {
  var node = parentNode.querySelector(nodeKey);
  console.log(typeof nodeValue);
  console.log(typeof nodeValue == 'string');
  console.log(nodeValue);
  console.log(nodeKey);
  console.log(parentNode);
  console.log(node);
  if (typeof nodeValue == 'string') {
    console.log('strtrigg');
    /*const subTag = node.querySelector('description');
    if(subTag && subTag.querySelector('para')) {
      subTag.querySelector('para').innerHTML = nodeValue
    }
    else {*/
      node.innerHTML = nodeValue;
    //}
  }
  else if (Array.isArray(nodeValue)) {
    console.log('arra');
    const emptyNodeTemplate = node.cloneNode(true);

    for (const [k, v] of Object.entries(nodeValue)) {
      if (k !== '0') { // Make new nodes for many to one
        const newSiblingNode = (emptyNodeTemplate.cloneNode(true) as HTMLElement);
        node = node.parentNode.insertBefore(newSiblingNode, node.nextSibling);
      }
      if (typeof v == 'string') {
        node.innerHTML = v;
      } else {
        for (const [label, item] of Object.entries(v)) {
          Seek(label, item, node);
        }
      }
    }
  }
  else if (typeof nodeValue == 'object') {
    console.log('obj');
    for (const [k, v] of Object.entries(nodeValue)) {
      console.log(k);
      console.log(v);
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
  console.log(inp_xmls);
  return '<?xml version="1.0" encoding="UTF-8"?>' + inp_xmls;
};

export default MakePopulatedEML;
