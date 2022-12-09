var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UsersSchema = new Schema({
    UserID: { type: String},
    Name: {type: String},
    Role: {type: String},
    Email: { type: String, required: true},
    Password: { type: String, required: true, minlength: 6},
    LoginActivity: { type: Array},
    AccessActivity: {type: Array},
    EditActivity:{type: Array}
},
{
    usePushEach: true
  });

// const Users = mongoose.model('user', UsersSchema);
var usermodel = mongoose.model("user", UsersSchema,"users");

module.exports = usermodel;