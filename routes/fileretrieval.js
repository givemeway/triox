var mongoose = require('mongoose');
var AWS = require('aws-sdk');
var multer = require('multer');
var multerS3 = require('multer-s3');
var express = require('express');
var path = require('path');
var router = express.Router();
var Files = require('./../models/filelookup');
AWS.config.loadFromPath('./config/AWSConfig.json');

S3 = new AWS.S3({});

router.post('/', function(req, res, next) {
    
        var NoteID = req.body.noteid;

        fetchNotesImages(NoteID)
        .then(URLS=>{
                        
                        res.status(200).json(URLS);
                    })
        .catch((error)=>{ console.log(error); res.status(200).json(error)});

    });

    async function fetchNotesImages(noteID){
        
                var foundattachments = await Files.find({"NoteID" : noteID});
                var urls = await getIndividualNoteImageURLS(foundattachments);
                return urls;
    } 
        
    async function getIndividualNoteImageURLS(foundattachments){
        var TotalURLs = [];
        await foundattachments.forEach(async function(attachment){
                    var url;
                    var params = { Bucket: 'testuploadsandeep', Key : attachment.Key, Expires: 600};
                    url = await getimageURL(params);
                    TotalURLs.push(url);  
                });
        return TotalURLs;
    }
  
    async function getimageURL(params){ 
        
        var URL =  await S3.getSignedUrl('getObject', params);
         
         return URL;       
    }

module.exports = router;