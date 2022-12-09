const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
var Customer = require('./../models/customers');
var Notes = require('./../models/notes');
var Key = require('../config/config');
var NotesFoundCount;

router.post('/', (req, res)=>{

    const HeaderToken = req.headers.authorization;
    const fetchAllnotes = req.body.getAllNotes;
    var skipresults=0;
    var notesFoundNumber;

    jwt.verify(HeaderToken, Key.mysecret, (err, decode)=>{
        if(err){
            res.status(401).json(err);
        }
        else{
            
            Notes.find({"Parent ID" : req.body.data})
            .then(notes=>{
                notesFoundNumber = notes.length;
                if(!fetchAllnotes){
                    if(notes.length <=3){
                        
                     skipresults = 0; 
                                             
                    }
                     else if ( notes.length > 3){
                      skipresults = notes.length - 3;
                    }
                }
                else{
                    skipresults = 0;  
                }

               return Notes.find({"Parent ID" : req.body.data})
                .sort({"Created Time": 1})
                .skip(skipresults);
                
            })
            .then((notesFound)=>{
                        
                        notesFound.forEach(function(note){
                            
                            var temp = note["Note Content"].replace( /([a-zA-Z0-9._+-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi, "********");
                            note["Note Content"] = temp;
                        });
                        res.status(200).json({ NoteResults : notesFound, totalNotesFound: notesFoundNumber});
                
            })
            .catch((err)=>{ console.log(err); res.status(500).json({
                message: 'Something went wrong'
            })

            });;
            
        }
    });
    
});

module.exports = router;