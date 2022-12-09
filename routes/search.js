const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
var Customer = require('./../models/customers');
var Key = require('../config/config');
// var MongoClient = require('mongodb').MongoClient;

router.post('/', (req, res)=>{

    const HeaderToken = req.headers.authorization;
    const searchQuery = req.body.name;
   
    jwt.verify(HeaderToken, Key.mysecret, (err, decode)=>{
        if(err){
            res.status(401).json(err);
        }
        else{

                if(decode.Role === "Technician" || decode.Role === "Sales" ){

                    Customer.find({ $text: {$search :  searchQuery }},{"First Name": 1, "Last Name": 1, "Customer Status": 1,"Created Time":1,"Annual Revenue":1,"Chat ID": 1})
                    .sort({"Created Time": -1 })
                    .then((foundCustomers)=>{
                        
                        res.status(200).json({ searchResults : foundCustomers});
                    })
                    .catch((err)=>{ res.status(500).json(err);
                    }); 
                    
                }
                else if(decode.Role ==="Administrator"){
                       
                        Customer.find({ $text: {$search :  searchQuery }})
                        .sort({"Time": -1 })
                        .then((foundCustomers)=>{
                            
                            res.status(200).json({ searchResults : foundCustomers});
                        })
                        .catch((err)=>{ res.status(500).json(err);
                        }); 
                    
                }
        }
    });
    
});

module.exports = router;