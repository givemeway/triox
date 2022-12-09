const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
var Customer = require('./../models/customers');
var Key = require('../config/config');

router.post('/', (req, res)=>{

    const HeaderToken = req.headers.authorization;

    jwt.verify(HeaderToken, Key.mysecret, (err, decode)=>{
        if(err){
            res.status(401).json(err);
        }
        else{
                if(decode.Role === "Sales" || decode.Role === "Administrator"){
                    Customer.create(req.body, (err, createdUser)=>{
                        if(err){
                            res.status(204).json(
                                {message: "failed to create user" } 
                              );
                        }
                        else{
                            var timeStamp;
                            
                            // createdUser["Customer ID"] = createdUser._id;
                            // createdUser["Full Name"] = req.body["First Name"] + " " + req.body["Last Name"];
                            // createdUser["Modified by ID"] =  req.body["Customer Owner ID"];
                            createdUser["Customer Owner ID"] = req.body["Customer Owner ID"];
                            // createdUser["Created Time"]= timeStamp = Date.now();
                            // createdUser["Modified Time"] = createdUser["Last Activity Time"] = timeStamp;
                            
                            createdUser.save((err, savedUser)=>{
                                if(err){
                                    res.status(204).json(
                                        {message: "failed to create user" } 
                                      );
                                }
                                else{
                                    
                                    res.status(200).json(savedUser);
                                }
                            });
                        }
                    });
                }
                else{
                    res.status(401).json("Denied");
                }
        }
    });
  
    
});

module.exports = router;