var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var notesSchema = new Schema({
    "Note Owner": { type: String},
    "Note Owner ID": { type: String},
    "Note Title": { type: String},
    "Note Content": { type: String},
    "Parent Name": { type: String},
    "Parent ID": { type: String},
    "Created By": { type: String},
    "Created By ID": { type: String},
    "Modified by ID": { type: String},
    "Created Time": { type: Date},
    "Modified Time": { type: Date},
    "Note Status":{type: String},
    "Issue Type":{type: String},
    "Issue Description": {type: String},
    "TroubleShooting Steps":{type: String}

},
{
    usePushEach: true
  });

var Notes = mongoose.model('Notes', notesSchema, 'notes');
module.exports =  Notes;