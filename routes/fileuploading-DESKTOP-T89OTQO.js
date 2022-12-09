const mongoose = require('mongoose');
const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const express = require('express');
const path = require('path');
const router = express.Router();
var Files = require('./../models/filelookup');

AWS.config.loadFromPath('./config/AWSConfig.json');

var S3 = new AWS.S3({});

var upload = multer({
    storage: multerS3({
        s3: S3,
        bucket: 'testuploadsandeep',
        acl: 'authenticated-read',
        contentDisposition: "inline",
        metadata: function(req, file, cb){
                cb(null, {
                    fieldname: file.fieldname
                })
        },
        key: function(req, file, cb){
                cb(null, Date.now() + '_' + file.originalname)
        }
    })
}).any();

router.post('/', function(req, res, next){
            // console.log(req.headers);
            upload(req,res,function(err){
                console.log(err);
                console.log(req.files);

                if(!err){
                    var file = new Files({
                        ParentID: req.headers.parentid,
                        NoteID: req.headers.noteid,
                        Bucket: "testuploadsandeep",
                        S3Location: req.files[0]["location"],
                        OwnerID: req.headers.ownerid,
                        Key:  req.files[0]["key"],
                        OriginalName:  req.files[0]["originalname"]
                    });
    
                    file.save()
                    .then((savedfile)=>{
                        console.log(savedfile);
                        res.status(200).json({DBFile: savedfile, AWSFile: req.files[0]});
                    })
                    .catch(error=>{ console.log(error); res.status(500).json({Error: error, AWSFile: req.files[0]})});
                }
                else{
                    res.status(500).json({Error: err, AWSFile: req.files[0]});
                }

                
        });
        
        
});

module.exports = router;
