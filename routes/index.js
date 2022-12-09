const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
var Leads = require('./../models/customers');
var Key = require('../config/config');

router.post('/', (req, res)=>{
    const index = Math.abs(req.body.index);
    const page = Math.abs((req.body.page - 1)*index);
    const sort = req.body.sort;
    const sortelement = req.body.sortelement;
    const HeaderToken = req.headers.authorization;

    jwt.verify(HeaderToken, Key.mysecret, function(err, decode){

        if(err){
            res.status(401).json(err);
        }
        else{
             
            if(decode.Role ==="Technician" || decode.Role === "Sales"){
                Leads.find({},{
                    "Customer Status": 1,"First Name": 1, "Last Name": 1,
                    "Customer Owner ID": 1, "Modified by ID": 1,"Created Time":1,"Modified Time":1,
                    "Sale Agent":1    
                })
                .sort({[sortelement] : sort})
                .limit(index)
                .skip(page)
                .exec((err, docs)=>{
                    if(err){
                        res.json(err);
                    }
                    gettotalleadscount().then(count=>{
                        res.send({docs:docs, count:count});
                   });
                });
            }
            else if(decode.Role === "Administrator"){
                Leads.find({})
                .sort({[sortelement] : sort})
                .limit(index)
                .skip(page)
                .exec((err, docs)=>{
                    if(err){
                        res.json(err);
                    }

                    gettotalleadscount().then(count=>{
                         
                         res.send({docs:docs, count:count});
                    });
                    
                });

             
            }
        }
    });

    
});

async function gettotalleadscount(){
    // var sumTotal = await Leads.aggregate([{$group: { _id : "$Payment Gateway", total:{ $sum: "$Annual Revenue" },count: { $sum: 1} }}]);
    // var count = await Leads.count();
    // return count;
    var sumTotal = await Leads.aggregate([{$group: { _id : "$_id:", count: { $sum: 1} }}]);
    return sumTotal;
}  
module.exports = router;