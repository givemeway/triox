const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
var Devices = require('./../models/customers');
var Notes = require('./../models/notes');
var Key = require('../config/config');
// require('core-js/modules/es.promise');
// require('core-js/modules/es.string.includes');
// require('core-js/modules/es.object.assign');
// require('core-js/modules/es.object.keys');
// require('core-js/modules/es.symbol');
// require('core-js/modules/es.symbol.async-iterator');
// require('regenerator-runtime/runtime');
var x1 = require('excel4node');


router.post('/', (req, res)=>{

    const HeaderToken = req.headers.authorization;
    _ids = req.body.ids
    jwt.verify(HeaderToken, Key.mysecret, function(err, decode){

        if(err){
            console.log("unauthorized")
            res.status(401).json(err);
        }
        else{
            if(decode.Role ==="Technician" || decode.Role === "Sales"){
                
                res.status(401).json("Denied");
            }
            else if(decode.Role === "Administrator"){
                Devices.find().where('_id').in(_ids).exec(async (error,records)=>{
                    if(error){
                        res.status(500).json(error)
                    }
                    else{


                                createExcel(records).then((wb)=>{ 
                                    wb.write('Download.xlsx', res)});
                    }
                    });
                
            }
        }
    });

    
});

async function createWorksheets(wb,json_array){
    var wsobjects = []
    var worsheetOptions = {
        'sheetFormat': {
            'defaultColWidth': 8,
            'defaultRowHeight': 15
        }
    }
    for(let i=0;i<json_array.length;i++){
        wsobjects.push(wb.addWorksheet(json_array[i]["Board Name"],worsheetOptions))
    }
    var imgStyle = {
        path:"picture.jpg",
        type: "picture",
        position: {
            type: 'twoCellAnchor',
            from: {
                col: 1,
                colOff:0,
                row:1,
                rowOff:0
            },
            to: {
                col:4,
                colOff:0,
                row:5,
                rowOff:0
            },
        },
    }
    var imgStyle2 = {
        path:"Picture2.jpg",
        type: "picture",
        position: {
            type: 'twoCellAnchor',
            from: {
                col: 12,
                colOff:0,
                row:36,
                rowOff:0
            },
            to: {
                col:13,
                colOff:0,
                row:36,
                rowOff:'2cm'
            },
        },

    }
    var border = {
            left:{
                style: 'medium'
            },
            right:{
                style: 'medium'
            },
            top:{
                style: 'medium'
            },
            bottom:{
                style: 'medium'
            }
        }
    var headStyle = wb.createStyle({
        font: {
            bold:true,
            size: 22,
            family: 'modern'
        },
        alignment: {
            horizontal: 'center'
        },
        border: border
    })
    var tabHeadStyle = wb.createStyle({
        font: {
            bold:true,
            size: 10,
            family: 'modern',
            name: 'Arial',
        },
        alignment: {
            horizontal: 'center'
        },
        border: border
    })

    var tableContentStyle = wb.createStyle({
        font: {
            bold:false,
            size: 10,
            family: 'modern',
            name: 'Arial',
        },
        alignment: {
            horizontal: 'left',
            vertical:'center',
            wrapText:true
        }
    })
    var tableContentStyle2 = wb.createStyle({
        font: {
            bold:false,
            size: 10,
            family: 'modern',
            name: 'Arial',
        },
        alignment: {
            horizontal: 'left',
            vertical:'center',
            wrapText:true
        },
        border: {
            bottom : {
                style: "medium"
            }
        }
    })
    var pcbareportStyle = wb.createStyle({
        font: {
            bold:true,
            size: 10,
            family: 'modern'
        },
        alignment: {
            horizontal: 'left',
            vertical:'center',
            shrinkToFit:true,
            wrapText:true
        }
    })
    var pcbareportHeadStyle = wb.createStyle({
        font: {
            bold:true,
            size: 11,
            family: 'modern'
        },
        alignment: {
            horizontal: 'center'
        },
        border: border
    })
    var passfailstyle = { alignment: 
                                { horizontal: 'center',
                                  wraptext:true,
                                  vertical:'justify'
                                },
                           font: {
                                    bold:true,
                                    size:10,
                                    name:'Arial'}
                        };
    var passfailstyle2 = { alignment: 
                            { horizontal: 'center',
                              wraptext:true,
                              vertical:'justify'
                            },
                            font: {
                                        bold:true,
                                        size:10,
                                        name:'Arial'},

                            border: {
                                bottom : {
                                    style: "medium"
                                }
                            }    
                        };

    for(let i=0;i<wsobjects.length;i++){
        wsobjects[i].row(8).setHeight(29)
        wsobjects[i].column(1).setWidth(13)
        wsobjects[i].cell(8,1,8,11,true).string("PCBA ASSEMBLY QC AND PRODUCT TEST CHECKLIST").style(headStyle)
        wsobjects[i].cell(31,13,31,22,true).string("PCBA TEST REPORT").style(pcbareportHeadStyle)
        // wsobjects[i].cell(37,13,42,22,true).string(" ").style(pcbareportStyle)
        wsobjects[i].cell(9,1).string("Sl No").style(tabHeadStyle)
        wsobjects[i].cell(9,2,9,7,true).string("Features").style(tabHeadStyle)
        wsobjects[i].cell(9,8,9,9,true).string("PASS/FAIL").style(tabHeadStyle)
        wsobjects[i].cell(9,10,9,11,true).string("Remarks").style(tabHeadStyle)
        wsobjects[i].addImage(imgStyle);
        wsobjects[i].addImage(imgStyle2);
    }

    for(let i=0;i<wsobjects.length;i++){
        var row = 10
        try{
            for (let j=0; j<json_array[i]['DeviceTestInfo'].length;j++){
            
                var len = json_array[i]['DeviceTestInfo'][j]['Features'].length
                if (len>=60 && len <=120){
                    wsobjects[i].row(row).setHeight(29)
                }
                else if (len>120 && len<=150){
                    wsobjects[i].row(row).setHeight(43)
                }
                if( j != json_array[i]['DeviceTestInfo'].length - 1){
                    wsobjects[i].cell(row,1).number(parseInt(json_array[i]['DeviceTestInfo'][j]['Sl No'])).style(passfailstyle)
                    wsobjects[i].cell(row,2,row,7,true).string(json_array[i]['DeviceTestInfo'][j]['Features']).style(tableContentStyle)
                    wsobjects[i].cell(row,8,row,9,true).string(json_array[i]['DeviceTestInfo'][j]['PASS/FAIL']).style(passfailstyle)
                    wsobjects[i].cell(row,10,row,11,true).string(json_array[i]['DeviceTestInfo'][j]['Remarks']).style({border: {right: {style: "medium"}}})
                }
                else{
                    wsobjects[i].cell(row,1).number(parseInt(json_array[i]['DeviceTestInfo'][j]['Sl No'])).style(passfailstyle2)
                    wsobjects[i].cell(row,2,row,7,true).string(json_array[i]['DeviceTestInfo'][j]['Features']).style(tableContentStyle2)
                    wsobjects[i].cell(row,8,row,9,true).string(json_array[i]['DeviceTestInfo'][j]['PASS/FAIL']).style(passfailstyle2)
                    wsobjects[i].cell(row,10,row,11,true).string(json_array[i]['DeviceTestInfo'][j]['Remarks']).style({border: {right: {style: "medium"},bottom: {style: "medium"}}})
                }
                row += 1
            }
    
            wsobjects[i].cell(32,13,41,22,true).string(json_array[i]['Output']).style(pcbareportStyle)
        }
        catch(err){
            console.log(err)
        }
        

    }
    return wb
}

async function createExcel(json_array){
    var wb = new x1.Workbook();
    var style = wb.createStyle({
        font: {
            color: '#FF0800',
            size: 12,
          },
          numberFormat: '$#,##0.00; ($#,##0.00); -',
    });
    
    wb = await createWorksheets(wb,json_array);
    return wb
    
}


module.exports = router;