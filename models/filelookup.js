var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var filesLookUpSchema = new Schema({
        ParentID: {type: String},
        NoteID: {type: String},
        Bucket: {type: String},
        S3Location: {type: String},
        OwnerID: {type: String},
        Key: {type: String},
        OriginalName: {type: String}
},
{
        usePushEach: true
      });

var Files = mongoose.model('filesLookup', filesLookUpSchema,'files');
module.exports =  Files;