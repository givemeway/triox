const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
var Customer = require('./../models/customers');
var Notes = require('./../models/notes');
var Key = require('../config/config');
var NotesFoundCount;
// var mailgun = require("mailgun-js");
// var api_key = 'key-a6e8b46480012af582e798b6f21526aa';
// var DOMAIN = 'send.techexperts.online';
// var mailgun = require('mailgun-js')({apiKey: api_key, domain: DOMAIN});
var CustomerName,AgentName,LastModified,IssueType,TroubleShootingSteps,ParentID;

router.put('/', (req, res)=>{

    const HeaderToken = req.headers.authorization;
    jwt.verify(HeaderToken, Key.mysecret, (err, decode)=>{
        if(err){
            res.status(401).json(err);
        }
        else{   
                
                Notes.findById({"_id" : req.body.NoteID})
                .then((note)=>{

                       const NoteOwner = note["Note Owner ID"];
                      
                       if(NoteOwner === decode.Name){
                                note["Note Content"] = req.body.NoteContent;
                                note["Note Status"] = req.body.NoteStatus;
                                note["Issue Type"] = req.body.IssueType;
                                note["TroubleShooting Steps"] = req.body.Steps;
                                note["Issue Description"] = req.body.issueDescription;
                                note["Modified Time"] = new Date();
                                note["Modified by ID"] =  decode.Name;
                                return note.save();
                       }
                       else{
                        res.status(401).json("Denied");
                       }
                })
                .then(savednote=>{       
                                
                    if(savednote){
                        if( (decode.UserID !== "zcrm_1621357000004715001" && decode.UserID !== "zcrm_1621357000000087008" && decode.UserID !== "zcrm_1621357000000085003") ||  ( req.body.NoteStatus=="Voided" ||req.body.NoteStatus=="Refunded"
                          ||req.body.NoteStatus=="Service on Hold")){

                            if(req.body.NoteStatus=="Need Follow-Up" || req.body.NoteStatus=="Resolve Not Confirmed"||req.body.NoteStatus=="Transferred to Other Tech" 
                                ||req.body.NoteStatus=="Paid and Disconnected" ||req.body.NoteStatus=="Voided" ||req.body.NoteStatus=="Refunded"
                                ||req.body.NoteStatus=="Service on Hold"){
                                    
                                
                                // CustomerName = savednote["Parent Name"];
                                // AgentName = savednote["Modified by ID"];
                                // LastModified = new Date(savednote["Modified Time"]).toLocaleString();
                                // IssueType = savednote["Issue Type"];
                                // TroubleShootingSteps=savednote["TroubleShooting Steps"];
                                // ParentID=savednote["Parent ID"];
                                // var HTML = `<HTML>Please follow up <strong>${CustomerName}</strong> immediately. User was being handled by <strong>${AgentName}</strong> and last update was at ${LastModified}.
                                // <br>
                                // <br>
                                // <label>Issue Type : </label><span>${IssueType}</span>.
                                // <br>
                                // <label>TroubleShooting Steps Performed: </label><span>${TroubleShootingSteps}</span>;
                                // <br>
                                // <br>
                                // <br>
                                // Regards,
                                // <br>
                                // Tech Experts
                                // </HTML>`;
                                // var Subject='';
                                
                                // if(savednote["Note Status"]==="Refunded"){
                                    
                                //     Subject = 'UPDATE - '+"REFUNDED"+" - "+savednote["Parent Name"];
                                    
                                // }
                                // else if(savednote["Note Status"]==="Voided"){
                                   
                                //     Subject = 'UPDATE - '+"VOIDED"+" - "+savednote["Parent Name"];
                                    
                                // }
                                // else if(savednote["Note Status"]==="Service on Hold"){
                                    
                                //     Subject = 'CRITICAL - '+'REFUND'+" - "+savednote["Parent Name"];
                                    
                                // }
                                // else if( savednote["Note Status"]!="Service on Hold" ||savednote["Note Status"]!="Voided"||savednote["Note Status"]!="Refunded"){
                                    
                                //     Subject="CRITICAL FOLLOW UP "+" - "+savednote["Parent Name"];
                                // }       
                                
                                // var data = {
                                //     from: 'Tech Experts<support@send.techexperts.online>',
                                //     to: 'sand.kumar.gr@gmail.com,Anwarprodigy@gmail.com,shiva.ikya@gmail.com',
                                //     subject: Subject,
                                //     text: 'Follow UP Email',
                                //     html: HTML
                                //   };
                                //   mailgun.messages().send(data, function (error, body) {
                                //     if (error) {
                                       
                                //         console.log("got an error: ", error);
                                //     }
                                //     else{console.log(body);}
                                    
                                //   });                                    
                            }
                        }

                        Customer.update({_id: req.body.ParentID},
                            {$set: { "Modified by ID": decode.Name, 
                                                              "Modified Time": savednote["Modified Time"],
                                                              "Last Activity Time": savednote["Modified Time"],
                                                              "Customer Status": savednote["Note Status"]
                                   }
                            },
                            (err, customerAffected)=>{
                                if(err){
                                    res.status(500).json(err);
                                }
                                else{
                                   
                                    res.status(200).json(savednote);
                                    
                                }
                            });       
                        
                    }

                })
                .catch(error=>{  
                    res.status(500).json(error);
                });
            
        }
    });
    
});

module.exports = router;