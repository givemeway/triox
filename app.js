const express = require('express'),
mongoose = require('mongoose'),
bodyParser = require('body-parser'),
path = require('path'),
cors = require('cors'),
Leads = require('./models/customers'),
Notes = require('./models/notes'),
login = require('./routes/login'),
search = require('./routes/search'),
results = require('./routes/results'),
update = require('./routes/update'),
notes = require('./routes/notes'),
createuser = require('./routes/createuser'),
newNotes = require('./routes/newNotes'),
index = require('./routes/index.js'),
fetchDevices = require('./routes/fetchDevices'),
Mongodb = require('mongodb'),
signup= require('./routes/signup'),
editNotes = require('./routes/editNotes'),
reports = require('./routes/reports'),
Delete = require('./routes/delete'),
activity = require('./routes/activity');
jsbar = require('./routes/jsbar');
python = require('./routes/python');
var fileuploading = require('./routes/fileuploading.js');
var fileretrieval = require('./routes/fileretrieval.js');
var customers = require('./models/customers');
// const MongoClient = require('mongodb').MongoClient;
// var ObjectId = require('mongodb').ObjectID;
// const uri = "mongodb://localhost:27017/triox";
const clouduri  ="mongodb+srv://sandk:sandy85kumar@triox.znwpm.mongodb.net/triox?retryWrites=true&w=majority";
var PORT = process.env.PORT || 3000;

app = express();
mongoose.Promise = global.Promise;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

// connect to mongodb using mongoose
// mongoose.connect('mongodb://givemeway:givemeway@ds141264.mlab.com:41264/rvsp');
// mongoose.connect('mongodb://127.0.0.1:27017/newcrmapp');
// mongoose.connection
// .on('error', (err)=>{console.log("connection Failed to MongoDB " + err)})
// .once('open',()=>{console.log("Connected to Mongo")});

try { mongoose.connect(clouduri,{useNewUrlParser: true,useUnifiedTopology: true}).then(
    ()=>{
        console.log("Connected to Mongo");
    },
    error=>{
        console.log("connection Failed to MongoDB:  " + error)
    }
); 
}
catch (error) {
    handleError(error);
}

// connect to mongodb using Mongodb nodejs drivers.. BULK UPDATE WORKING

                    // MongoClient.connect('mongodb://127.0.0.1:27017/newcrmapp', function(err, db){
                    //     if(err){
                    //         throw err;
                    //     }
                    //     var notes = db.collection('notes'),
                    //     customers = db.collection('customers'),
                    //     users = db.collection('users');
                    //     bulk = notes.initializeOrderedBulkOp(),
                    //     counter = 0;
                    //     usersNotFound =0;
                    //     UserID = ["zcrm_1621357000000802001","zcrm_1621357000000091003","zcrm_1621357000004637001","zcrm_1621357000000085003",
                    //     "zcrm_1621357000000447019","zcrm_1621357000000091173","zcrm_1621357000004715001","zcrm_1621357000000443019","zcrm_1621357000002002247",
                    //     "zcrm_1621357000000156001","zcrm_1621357000000941003","zcrm_1621357000000087008","zcrm_1621357000002002237","zcrm_1621357000002031015"
                    //     ]; 
                    //     Agents = [ "Abhijit Aby","Rahul Parasar","Praveen Gowda","Sandeep Kumar G R","Shohan R","Shibin","Hisham Akbar","Vijay Kumar","Bharat Patel",
                    //         "Kausik M","Karthik J","Abhijit Ghosh","Nitin Vasudev","Shiva Kumar"];

                    //     notes.find({ }).forEach(function(note){

                    //             for(let i=0;i<UserID.length; i++){

                    //                 bulk.find( { "Modified by ID": UserID[i] } ).update( {$set: { "Modified by ID": Agents[i] } } );
                    //                 bulk.find( { "Created by ID": UserID[i] } ).update( {$set: { "Created by ID": Agents[i] } } );
                    //                 bulk.find( { "Note Owner ID": UserID[i] } ).update( {$set: { "Note Owner ID": Agents[i] } } );
                    //                 bulk.find( { "Note Owner": Agents[i] } ).update( {$set: { "Note Owner ID": Agents[i] } } );
                    //                 bulk.find( { "Modified By": Agents[i] } ).update( {$set: { "Modified by ID": Agents[i] } } );
                    //                 bulk.find( { "Created By": Agents[i] } ).update( {$set: { "Created by ID": Agents[i] } } );
                    //                 counter++;
                    //                 console.log(counter);
                    //                 bulk.execute(function(err, results){

                    //                     if(err){
                    //                         console.log("err", err);
                    //                     }
                    //                     if(results){
                    //                         console.log("Results: ", counter);
                    //                     }
                    //                 });  
                    //             }  

                    //             bulk.find({"_id": note._id}).updateOne({$set: { "Created Time":  (new Date( note["Created Time"]
                    //             .replace( /(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3")).getTime()).toString()}
                    //                                                 });

                    //             bulk.find({"_id": note._id}).updateOne({$set: { "Modified Time":  (new Date( note["Modified Time"]
                    //             .replace( /(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3")).getTime()).toString()}
                    //                                                 });   

                    //             customers.findOne({ "Customer ID" : note["Parent ID"]}, function(err, parent){
                    //                 if(parent){
                    //                     bulk.find( { "_id" : note._id}).updateOne( {
                    //                         "$set" : { "Parent ID" :  parent._id.toString()}
                    //                     });   
                                        
                    //                     counter++;
                    //                     console.log(counter);
                    //                     bulk.execute(function(err, results){
                    //                         if(err){
                    //                             console.log("err", err);
                    //                         }
                    //                         if(results){
                    //                             console.log("Results: "+counter);
                    //                         }
                    //                     });  
                                        
                    //                 }                                   
                    //             });
                                     
                    //     });
                    // });    
                    // MongoClient.connect('mongodb://127.0.0.1:27017/newcrmapp', function(err, db){
                    //     if(err){
                    //         throw err;
                    //     }
                    // var notes = db.collection('notes'),
                    // bulk = notes.initializeOrderedBulkOp(),
                    // counter = 0;
                    // usersNotFound =0;
                    //     notes.find({ }).forEach(function(note){
                    //         bulk.find({"_id": note._id}).updateOne({$set: { "Created Time":  (new Date( note["Created Time"]
                    //                                                 .replace( /(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3")).getTime()).toString()}
                    //                                     });
                    //         bulk.find({"_id": note._id}).updateOne({$set: { "Modified Time":  (new Date( note["Modified Time"]
                    //                                                 .replace( /(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3")).getTime()).toString()}
                    //                                     });                            
                    //         counter++;
                    //         console.log(counter);                                
                    //                 bulk.execute(function(err, results){
                    //                     if(err){
                    //                         console.log(err);
                    //                     }
                    //                     if(results){
                    //                         console.log(results.toJSON);
                    //                     }
                    //                 });
                                       
                    //     });
                    // });
                    // MongoClient.connect('mongodb://127.0.0.1:27017/newcrmapp', function(err, db){
                    //     if(err){
                    //         throw err;
                    //     }
                    // var notes = db.collection('notes'),
                    // customers = db.collection('customers'),
                    // bulk = customers.initializeOrderedBulkOp(),
                    // counter = 0;
                    // UserID = ["zcrm_1621357000000802001","zcrm_1621357000000091003","zcrm_1621357000004637001","zcrm_1621357000000085003",
                    // "zcrm_1621357000000447019","zcrm_1621357000000091173","zcrm_1621357000004715001","zcrm_1621357000000443019","zcrm_1621357000002002247",
                    // "zcrm_1621357000000156001","zcrm_1621357000000941003","zcrm_1621357000000087008","zcrm_1621357000002002237","zcrm_1621357000002031015"
                    // ]; 
                    // Agents = [ "Abhijit Aby","Rahul Parasar","Praveen Gowda","Sandeep Kumar G R","Shohan R","Shibin","Hisham Akbar","Vijay Kumar","Bharat Patel",
                    //     "Kausik M","Karthik J","Abhijit Ghosh","Nitin Vasudev","Shiva Kumar"];

                    // var counter  =0;
                    // customers.find({ })
                    // .then(customers=>{ customers.forEach(function(customer){

                    //         counter++;
                    //         Notes.find({"Parent ID": (customer._id).toString()})
                    //         .then(Notes=>{
                    //                 Notes.forEach(note=>{
                    //                     note["Parent Name"]=customer["Full Name"];
                    //                     note.save().then(savednote=>{
                    //                         console.log(counter,savednote["Parent Name"]);
                    //                     });
                    //                 });
                    //         })
                    //         .catch(error=>{ console.log(error)});
                            // bulk.find({"_id": customer._id}).updateOne({$set: { "Created Time":  (new Date( customer["Created Time"]
                            //                                         .replace( /(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3")).getTime()).toString()}
                            //                             });
                            // bulk.find({"_id": customer._id}).updateOne({$set: { "Modified Time":  (new Date( customer["Modified Time"]
                            //                                         .replace( /(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3")).getTime()).toString()}
                            //                             });
                            // bulk.find({"_id": customer._id}).updateOne({$set: { "Last Activity Time":  (new Date( customer["Last Activity Time"]
                            //                                         .replace( /(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3")).getTime()).toString()}
                            //                             });                                                                  

                            // bulk.find({ "_id": customer._id}).updateOne({$set: { "Created Time": new Date(parseInt(customer["Created Time"]))}});
                            // bulk.find({ "_id": customer._id}).updateOne({$set: { "Modified Time": new Date(parseInt(customer["Modified Time"]))}});
                            // bulk.find({ "_id": customer._id}).updateOne({$set: { "Last Activity Time": new Date(parseInt(customer["Last Activity Time"]))}});
                            // bulk.find({_id: customer._id}).updateOne({ $set: {  "Full Name": customer["First Name"] + " " + customer["Last Name"]} 
                            //                                         });
                            

                              
                                // for(let i=0;i<UserID.length; i++){

                                //     bulk.find( { "Modified by ID": UserID[i] } ).update( {$set: { "Modified by ID": Agents[i] } } );
                                //     bulk.find( { "Created by ID": UserID[i] } ).update( {$set: { "Created by ID": Agents[i] } } );
                                //     bulk.find( { "Customer Owner ID": UserID[i] } ).update( {$set: { "Customer Owner ID": Agents[i] } } );
                                //     bulk.find( { "Customer Owner": Agents[i] } ).update( {$set: { "Customer Owner ID": Agents[i] } } );
                                //     bulk.find( { "Modified By": Agents[i] } ).update( {$set: { "Modified by ID": Agents[i] } } );
                                //     counter++;
                                //     console.log(counter);
                                //     bulk.execute(function(err, results){

                                //         if(err){
                                //             console.log("err", err);
                                //         }
                                //         if(results){
                                //             console.log("Results: ", counter);
                                //         }
                                //     });  
                                //  }  
                                       
                    //     });   
                    // });         
//router configuration
app.use('/auth/login', login);
app.use('/auth/search', search);
app.use('/auth/results', results);
app.use('/auth/update', update);
app.use('/auth/notes', notes);
app.use('/auth/createuser', createuser);
app.use('/auth/index', index);
app.use('/auth/newNotes', newNotes);
app.use('/auth/signup', signup);
app.use('/auth/editNotes', editNotes);
app.use('/auth/delete', Delete);
app.use('/auth/reports', reports);
app.use('/auth/fileuploading', fileuploading);
app.use('/auth/fileretrieval', fileretrieval);
app.use('/auth/activity',activity);
app.use('/auth/jsbar',jsbar);
app.use('/auth/python',python);
app.use('/auth/fetchDevices',fetchDevices)

app.use('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
  });


app.listen(PORT, (error)=>{
    console.log(`listening on PORT: ${PORT}`); 
    if(error){
        console.log(error);
    }
});

