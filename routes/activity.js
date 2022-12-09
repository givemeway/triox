const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
var Users = require('../models/users');
var Key = require('../config/config');

router.get('/', (req, res)=>{
    const HeaderToken = req.headers.authorization;
    const fetchAllnotes = req.body.getAllNotes;
    var skipresults=0;
    var notesFoundNumber;
 
    jwt.verify(HeaderToken, Key.mysecret, (err, decode)=>{
        if(err){
            console.log(err);
            res.status(401).json(err);
        }
        else{ 
            if(decode.Role ==="Technician" || decode.Role === "Sales"){
                res.status(401).json("Denied");
            }
            else if(decode.Role ==="Administrator" ){
                Users.find({}, {Name:1, LoginActivity:1, AccessActivity:1, EditActivity:1,_id:0 })
            .then(users=>{
                res.status(200).json(users);
            })
            .catch(error=>{
                console.log(error);
                res.status(500).json(error);
            });
            }
            
            
        }
    });
    
});

module.exports = router;