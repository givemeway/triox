const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Users = require('../models/users');


router.post('/', (req, res)=>{

    const Email = req.body.Email;
    const Password = req.body.Password;
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(Password, salt);

    Users.findOne({Email: Email})
    .then(user=>{
        console.log(user);
        user.update({ $set: {"Password": hash }})
        .then((user)=>{ console.log(user); res.status(200).json(user)});
    })
    .catch(err=>{res.status(500).json(err)});
});

module.exports = router;