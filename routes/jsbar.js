const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
var Key = require('../config/config');
var JsBarcode = require('jsbarcode');
const { DOMImplementation, XMLSerializer } = require('xmldom');
const xmlSerializer = new XMLSerializer();
const document = new DOMImplementation().createDocument('http://www.w3.org/1999/xhtml', 'html', null);
const svgNode = document.createElementNS('http://www.w3.org/2000/svg', 'svg');


router.post('/', (req, res)=>{
    console.log('here in the jsbar')
    const HeaderToken = req.headers.authorization;
    jwt.verify(HeaderToken, Key.mysecret, function(err, decode){

        
        if(err){
            res.status(401).json(err);
        }
        else{

            console.log(req.body)
            JsBarcode(svgNode, 'eMPCBA-V00001', {
                xmlDocument: document,
            });
            
            const svgText = xmlSerializer.serializeToString(svgNode);
            res.status(200).json(svgText)
            
        }
    });

    
});

module.exports = router;