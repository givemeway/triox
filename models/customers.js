var mongoose = require('mongoose');
var notes = require("./notes");

var Schema = mongoose.Schema;

var customerSchema = new Schema({

        "Board Name" : {type: String},
        "Device ID"  : {type: String},
        "MAC ADDRESS:": {type: String},
        "Time":{type:String},
        "Description":{type:String},
        "Customer Owner ID":{type:String},
        "Modified By":{type:String},
        "Last Activity Time":{type:String},
        "Output": {type:String},
        "DeviceTestInfo":{type: mongoose.Mixed}
},
{
        usePushEach: true
},
{       strict: false
});

var Leads = mongoose.model('Leads', customerSchema, 'devices');
module.exports = Leads;