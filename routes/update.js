const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
var Customer = require('./../models/customers');
var Users = require('./../models/users');
const moment = require('moment');
var Key = require('../config/config');

router.put('/', (req, res)=>{
   var key = req.body.property;
   var value = req.body.data;
   var modifiedBy =  req.body.currentAgentName;
   const HeaderToken = req.headers.authorization;
    jwt.verify(HeaderToken, Key.mysecret, (err, decode)=>{
        if(err){
            res.status(401).json(err);  
        }
        else{ 
                
                if(decode.Role === "Administrator"){
                    Customer.findById(req.body.objId, (error, customer)=>{

                        if(error){
                            res.status(500).json(error);
                        }
                        else{
                            SaveAccessDetails(customer,decode.Email,req.body.IPDetails,key,value).then((saveduser)=>a = 1)
                            .catch(error=>res.status(500).json({
                                message: 'Something went wrong'
                                }));
                                
                            if(!customer){
                                res.status(404).json("User Not found");
                            }
                            else{    if(typeof(key)=='object'){

                                        customer[key[0]][key[1]] = value
                                        customer.markModified('DeviceTestInfo');
                                        }
                                     else{
                                        customer[key] = value;
                                     }
                                     customer["Modified By"] = modifiedBy
                                     customer["Last Activity Time"] = new Date()
                                     customer.save((err, updatedcustomer)=>{
                                     res.status(200).json({
                                        updaterecords: updatedcustomer
                                    });
                                });
                            }      
                        }
                    });
                }
                else{
                    res.status(401).json("Denied");
                }
                
            
        }
    });
    
});

async function SaveAccessDetails(customer,UserEmail,IPDetails,key,value){
    
    
    IPDetails.EditTime = new Date();
    IPDetails.ParentID = customer._id;
    IPDetails.ParentName = customer["Board Name"];
    IPDetails.EditedModule = key;
    IPDetails.PriorToEdit = customer[key];
    IPDetails.ValueAfterEdit = value;
    var user = await Users.findOne({Email: UserEmail});
    user.EditActivity.push(IPDetails);
    var EditActivity = await user.save();
    return  EditActivity;   
}

module.exports = UnixTimeFormatter = function (DateFormat){

    var date = moment(DateFormat).format(),
    timestamp = moment(date).format("x");
    return timestamp;
}

module.exports = TimeStampToDateFormatter = function (TimeStamp,HHMM){

    var todate=new Date(TimeStamp).getDate();
    var tomonth=new Date(TimeStamp).getMonth()+1;
    var toyear=new Date(TimeStamp).getFullYear();
    
    if(HHMM){
    return new Date(TimeStamp);
 
    }

    var original_date = tomonth+'/'+todate+'/'+toyear;

    return original_date;
}

module.exports = router;