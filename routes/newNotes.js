const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
var Customer = require('./../models/customers');
var Notes = require('./../models/notes');
var Key = require('../config/config');
// var mailgun = require("mailgun-js");
// var api_key = 'key-a6e8b46480012af582e798b6f21526aa';
// var DOMAIN = 'send.techexperts.online';
// var mailgun = require('mailgun-js')({apiKey: api_key, domain: DOMAIN});
// var CustomerName,AgentName,LastModified,IssueType,TroubleShootingSteps,ParentID;


router.post('/', (req, res)=>{

    const HeaderToken = req.headers.authorization;
    jwt.verify(HeaderToken, Key.mysecret, (err, decode)=>{
        if(err){
            res.status(401).json(err);
        }
        else{  
                Customer.findById(req.body.ParentID, (error, customer)=>{
                    if(error){
                        res.status(500).json(error);
                    }
                    
                    notes = new Notes ({
                        "Note Owner": req.body.CurrentAgentName,
                        "Note Owner ID": decode.Name,
                        "Note Title": ' ',
                        "Note Content": req.body.NoteObject.content,
                        "Parent Name": customer["Board Name"],
                        "Parent ID": req.body.ParentID,
                        "Created By ID": req.body.CurrentAgentName,
                        "Modified by ID":req.body.CurrentAgentName,
                        "Created Time": new Date(),
                        "Modified Time":  new Date(),
                        "Note Status": req.body.NoteObject.status,
                        "Issue Type": req.body.NoteObject.issueType,
                        "Issue Description": req.body.NoteObject.issueDescription,
                        "TroubleShooting Steps": req.body.NoteObject.steps
                    });

                   
                    notes.save()
                    .then((createdNotes)=>{
                            
                            if((decode.UserID !== "zcrm_1621357000004715001" &&  decode.UserID !== "zcrm_1621357000000087008" && decode.UserID !== "zcrm_1621357000000085003") || (req.body.NoteObject.status=="Voided" ||req.body.NoteObject.status=="Refunded"
                            ||req.body.NoteObject.status=="Service on Hold")){

                                if(req.body.NoteObject.status=="Need Follow-Up" || req.body.NoteObject.status=="Resolve Not Confirmed"||req.body.NoteObject.status=="Transferred to Other Tech" 
                                    ||req.body.NoteObject.status=="Paid and Disconnected" ||req.body.NoteObject.status=="Voided" ||req.body.NoteObject.status=="Refunded"
                                    ||req.body.NoteObject.status=="Service on Hold"){

                                    // console.log("inside mail gun condition");
                                    // CustomerName = createdNotes["Parent Name"];
                                    // AgentName = createdNotes["Modified by ID"];
                                    // LastModified = new Date(createdNotes["Modified Time"]).toLocaleString();
                                    // IssueType = createdNotes["Issue Type"];
                                    // TroubleShootingSteps=createdNotes["TroubleShooting Steps"];
                                    // ParentID=createdNotes["Parent ID"];
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
                                    // if(createdNotes["Note Status"]==="Refunded"){
                                    //     Subject = 'UPDATE - '+'$'+customer['Annual Revenue']+"USD"+" - "+"REFUNDED"+" - "+customer["Full Name"];
                                    // }
                                    // else if(createdNotes["Note Status"]==="Voided"){
                                    //     Subject = 'UPDATE - '+'$'+customer['Annual Revenue']+"USD"+" - "+"VOIDED"+" - "+customer["Full Name"];
                                    // }
                                    // else if(createdNotes["Note Status"]==="Service on Hold"){
                                    //     Subject = 'CRITICAL - '+"REFUND"+" - "+'$'+customer['Annual Revenue']+"USD"+" - "+customer["Full Name"];
                                    // }
                                    // else if(createdNotes["Note Status"]!="Service on Hold"||createdNotes["Note Status"]!="Voided"||createdNotes["Note Status"]!="Refunded"){
                                    //     Subject="CRITICAL FOLLOW UP "+" - "+customer["Full Name"];
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
                                            {$set: { "Modified by ID": req.body.CurrentAgentName, 
                                                                              "Modified Time": createdNotes["Modified Time"],
                                                                              "Last Activity Time": createdNotes["Modified Time"],
                                                                              "Customer Status": createdNotes["Note Status"]
                                                                            }
                                            },
                                            (err, customerAffected)=>{
                                                if(err){
                                                    res.status(500).json(err);
                                                }
                                                else{
                                                    createdNotes.CustomerAffected = customerAffected;
                                                    console.log(createdNotes);
                                                    res.status(200).json(createdNotes);
                                                    
                                                }
                                            });       
                                             
                            
                    })  
                    .catch((err)=>{
                        res.status(200).json(err);
                    });
                });   
        }
    });
    
});

module.exports = router;