const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
var Customer = require('./../models/customers');
var Users = require('./../models/users');
var Key = require('../config/config');

router.post('/', (req, res)=>{

    const HeaderToken = req.headers.authorization;

    jwt.verify(HeaderToken, Key.mysecret, (err, decode)=>{
        if(err){
            res.status(401).json(err);
        }
        else{

            if(decode.Role ==="Sales" || decode.Role === "Technician"){

                Customer.findById(req.body.data)
                .then((foundCustomers)=>{

                    SaveAccessDetails(foundCustomers,decode.Email,req.body.IPDetails).then((saveduser)=>console.log('test'))
                    .catch(error=>res.status(500).json({
                        message: 'Something went wrong'
                        }));
                
                    var email = foundCustomers["Email"].split("");
                    var masekedEmail ='';
                    for(let i=0; i<email.length;i++){ 
                        if(i%2 ==0 && email[i] != "@"){
                            email[i]='**'; 
                        }
                     }

                    for(let i=0;i<email.length;i++){
                         masekedEmail += email[i];
                     }
                    foundCustomers["Email"] = masekedEmail;
                    if(decode.UserID !== "zcrm_1621357000004715001" && decode.UserID !== "zcrm_1621357000000087008"){
                        // foundCustomers["Phone"] = foundCustomers["Phone"].replace(/\d(?=\d{4})/g, "*");
                        foundCustomers["Phone"] = "************";
                    }
                    
                    var temp = foundCustomers["Description"].replace( /([a-zA-Z0-9._+-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi, "*********");
                    foundCustomers["Description"] = temp;
                    res.status(200).json({ searchResults : foundCustomers}
                    );
                })
                .catch((err)=>{ res.status(500).json({
                    message: 'Something went wrong'
                    })
    
                });

            }
            else if(decode.Role ==="Administrator"){
                Customer.findById(req.body.data)
                .then((foundCustomers)=>{
                    SaveAccessDetails(foundCustomers,decode.Email,req.body.IPDetails).then((saveduser)=>console.log('saved'))
                    .catch(error=>res.status(500).json({
                        message: 'Something went wrong'
                        }));
                    res.status(200).json({ searchResults : foundCustomers}
                    );
                })
                .catch((err)=>{ res.status(500).json({
                    message: 'Something went wrong'
                    })
    
                });
            }
            
        }
    });
    
});

async function SaveAccessDetails(customer,UserEmail,IPDetails){

            var user = await Users.findOne({Email: UserEmail});
            IPDetails.AccessTime = new Date();
            IPDetails.ParentID = customer._id;
            IPDetails.ParentName = customer["Board Name"];
            user.AccessActivity.push(IPDetails);
            var savedUserActivity = await user.save();
            return  savedUserActivity;   
}

module.exports = router;