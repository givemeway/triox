const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
var Users = require('../models/users');
var Key = require('../config/config');

router.post('/', (req, res)=>{
    console.log(req.body)
    const password = req.body.password;
    const email = req.body.email;
    Users.findOne({Email: req.body.email})
    .then((user)=>{ 
            if(user){
                
                const hashedPassword = user.Password;
                var isPasswordMatch  = bcrypt.compareSync(password, hashedPassword);
                if(isPasswordMatch){
                        const payload = {UserID: user.UserID, Name:user.Name, Role:user.Role, Email:user.Email};
                        const token = jwt.sign(payload, Key.mysecret, {expiresIn: 1800});
                        const body = { Token: token, Email: user.Email, Name: user.Name, UserID: user.UserID};
                        req.body.IPDetails.LoginTime = new Date();
                        const activity = { GeoAddress : req.body.IPDetails};
                        user.LoginActivity.push(activity);
                        user.save((err, updateloginactivity )=>{
                            if(err){
                                console.log(err);
                                res.status(500).json(err);
                            }
                            else{
                               
                                res.status(200).json(body);
                            }
                           
                        });
                        
                }
                else{

                    res.status(401).json({message: "Unable to Login. Username or Password Incorrect"});
                }
            }
            else{
                res.status(401).json({message: "Unable to Login. Username or Password Incorrect"});
            }
    })
    .catch(error=>{ console.log(error); res.status(500).json(error)});


    
    
});

module.exports = router;