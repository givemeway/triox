
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
var Customer = require('./../models/customers');
var Notes = require('./../models/notes');
var Key = require('../config/config');
var JsBarcode = require('jsbarcode');
const { DOMImplementation, XMLSerializer } = require('xmldom');
const xmlSerializer = new XMLSerializer();
const document = new DOMImplementation().createDocument('http://www.w3.org/1999/xhtml', 'html', null);
const svgNode = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

// var MongoClient = require('mongodb').MongoClient;

router.post('/', (req, res)=>{

    const HeaderToken = req.headers.authorization;
    var options=req.body.bar_options
    options.xmlDocument = document
    jwt.verify(HeaderToken, Key.mysecret, (err, decode)=>{
        if(err){
            res.status(401).json(err);
        }
        else{   
                
            if (typeof(req.body.code)=="object"){
                options.text =req.body.code

                fetch_bulk_codes(req.body.code,options,req.body.truncate).then(data=>res.status(200).json(data)
                    ).catch(error=>res.status(500).json(error))
            }
            else{
                options.text =req.body.code
                JsBarcode(svgNode, req.body.code, options)
                const svgText = xmlSerializer.serializeToString(svgNode)
                res.status(200).json(svgText)         
            }
                      
                
        }
    });
    
});

async function fetch_bulk_codes(codes,options,truncate){
    var temp_list =[]
    
    for( let i=0;i<codes.length;i++){
        truncated_code = codes[i].slice(truncate)
        options.text = codes[i]
        JsBarcode(svgNode, truncated_code, options);
        
        svgText = await xmlSerializer.serializeToString(svgNode);
        temp_list.push(svgText)
    }
    return temp_list
}

module.exports = router;