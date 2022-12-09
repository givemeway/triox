const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
var Leads = require('./../models/customers');
var Notes = require('./../models/notes');
var Key = require('../config/config');

router.delete('/', (req, res)=>{

    const HeaderToken = req.headers.authorization;
    
    jwt.verify(HeaderToken, Key.mysecret, function(err, decode){

        if(err){
            console.log("unauthorized")
            res.status(401).json(err);
        }
        else{
            if(decode.Role ==="Technician" || decode.Role === "Sales"){
                
                res.status(401).json("Denied");
            }
            else if(decode.Role === "Administrator"){
                 var deletedrecords=[];
                for(let i=0; i<req.body.LeadID.length; i++){   

                    var deletelead = Leads.findByIdAndRemove({"_id": req.body.LeadID[i]});


                    var deleteNotes = Notes.remove({ "Parent ID": req.body.LeadID[i]});

                    Promise.all([deletelead,deleteNotes])
                    .then(deleted=>{
                        
                        deletedrecords.push(deleted);
                    })
                    .catch(error=>{
                        console.log(error);
                        return res.status(500).json('someting went wrong');
                    });;

                }
                
                res.status(200).json(deletedrecords);
            }
        }
    });

    
});

module.exports = router;