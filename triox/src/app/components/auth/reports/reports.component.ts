import { DetailsComponent } from './details/details.component';
import { AuthService } from './../../auth.service';
import { Component, OnInit,Injectable,ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer,SafeHtml  } from '@angular/platform-browser'
import { Router, ActivatedRoute, Params } from '@angular/router';
// import { FlashMessagesService } from 'angular2-flash-messages';
import { DatepickerOptions } from 'ng2-datepicker';
import jsPDF from 'jspdf';
import * as pdfMake from 'pdfmake/build/pdfmake.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';
var htmlToPdfmake =require('html-to-pdfmake') ;
import { Options } from '@angular-slider/ngx-slider';
import { ThrowStmt } from '@angular/compiler';
import { AnyArray } from 'mongoose';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

// import htmlToPdfmake from 'html-to-pdfmake';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
})
export class ReportsComponent implements OnInit {
  @ViewChild('pdfTable')
  pdfTable!: ElementRef<any>;
  @ViewChild('dataContainer') dataContainer: ElementRef | undefined;
  // options: DatepickerOptions = {
  //   minYear: 1970,
  //   maxYear: 2030,
  //   displayFormat: 'MMM DD YYYY',
  //   barTitleFormat: 'MMMM YYYY',
  //   firstCalendarDay: 0 // 0 - Sunday, 1 - Monday
  // };
  startdate: Date;
  enddate: Date;
  params:any;
  svg:any;
  image:any;
  salesReport = [];
  TSReport = [];
  totalSalesReport ={};
  FollowupReport = [];
  isFiltered = false;
  selectedModule:any;
  showReport = false;
  Columns = [];
  Rows = [];
  RowsSelected:any;
  ColumnsSelected:any;
  ColumnTotal:any;
  isPopup=false;
  popupRowData=[];
  RowsData = [];
  showCustomerReport = false;
  showTSReport = false;
  selectedValue=[];
  excludedlist=[];
  excludedProperty:any;
  ispopup:any;
  slider_values: any;
  isLoading: boolean | undefined;
  RowTransformedDetails:any;
  changestoselectedvalue=false;
  isGenerate=false;

  bytes_code:any;
  new_svg:SafeHtml | undefined;
  rows_columns_list:any
  code_options: any ={};
  value: number = 1;
  startcode:any;
  endcode:any;
  img_width:any;
  print_layout = ['Letter','Tabloid','Legal','Statement','Executive','A4','A3','A5','JIS B4',"JIS B5"]
  // size in cm
  paper_size = {    "Letter" : [21.59*10/ 0.2645833333,27.94*10/ 0.2645833333],
                    "Tabloid":[27.94*10/ 0.2645833333,43.18*10/ 0.2645833333],
                    "Legal":[21.59*10/ 0.2645833333,35.56*10/0.2645833333],
                    "Statement":[13.97*10/ 0.2645833333,21.59*10/ 0.2645833333],
                    "Executive":[18.42*10/ 0.2645833333,26.67*10/ 0.2645833333],
                    "A4":[21.00*10/ 0.2645833333,29.70*10/ 0.2645833333],
                    "A3":[29.70*10/ 0.2645833333,42.00*10/ 0.2645833333],
                    "A5":[14.80*10/ 0.2645833333,21.00*10/ 0.2645833333],
                    "JIS B4":[25.70*10/ 0.2645833333,36.40*10/ 0.2645833333],
                    "JIS B5":[18.20*10/ 0.2645833333,25.70*10/ 0.2645833333]    
                         }
                        //  *1 pixel = 0.2645833333 mm
  public downloadAsPDF() {
    const doc = new jsPDF();
   
    const pdfTable = this.pdfTable.nativeElement;
    
    var html = htmlToPdfmake(pdfTable.innerHTML);
    const documentDefinition = { content: html };
    pdfMake.createPdf(documentDefinition).download("barcodes.pdf"); 
    // var createPdf = pdfMake.createPdf(documentDefinition); 
    
    // var base64data = null;
    // createPdf.getBase64(encodedString=>{
    //   base64data = encodedString;
    //   console.log(base64data );
    //    var byteCharacters = atob(base64data);
    //    var byteNumbers = new Array(byteCharacters.length);
    //    for (var i = 0; i < byteCharacters.length; i++) {
    //        byteNumbers[i] = byteCharacters.charCodeAt(i);
    //        var byteArray = new Uint8Array(byteNumbers);
    //                     var file = new Blob([byteArray], { type: 'application/pdf;base64' });
    //                     var fileURL = URL.createObjectURL(file);
    //                     window.open(fileURL);
    //    }
    // });

    
  }   

  constructor( private sanitizer: DomSanitizer,private authservice: AuthService, public route: ActivatedRoute, private router: Router) { this.startdate = new Date; this.enddate = new Date;}

  ngOnInit() {
    this.totalSalesReport ={ Followup:0, "Resolved Confirmed":0,"Resolve Not Confirmed":0,"Paid and Transferred":0,Total:0};
    this.isFiltered = false;
    this.showTSReport = false;
    this.showCustomerReport = false;
    this.selectedValue=[];
    this.isPopup=false;
    this.excludedProperty=undefined;
    this.changestoselectedvalue=false;
    // this.svg = "<svg></svg>"
    this.startcode="eMPCBA-V0001"
    this.endcode="eMPCBA-V00012"
    this.isGenerate=false
    
    
    // this.dataContainer.nativeElement.innerHTML = this.svg;
    

    // this.route.queryParams.subscribe((params: Params)=>{ 
    //   var report = {  
    //     Rows: params.Rows, 
    //     Columns: params.Columns, 
    //     Match: {StartTime: params.StartTime, EndTime: params.EndTime},
    //     ColumnTotal: params.ColumnTotal, 
    //     Module: params.Module, 
    //     Exclude: params.Exclude, 
    //     ExcludedProperty: params.ExcludedProperty
    //   };
    //   this.isLoading = false;
    //   this.fetchReport(report);
    // });
    

    this.route.queryParams.subscribe((params: Params)=>{
        this.params = params['code']
        if(!this.params){
          this.params = "Example 123"
          this.code_options ={ height: 100, fontSize: 36,width:2,textAlign:"center",textMargin:0,margin:10,fontOptions:"bold"}
        }
        this.inputCode(this.params)
    });
    
  }

  inputCode(event:any){
    if (event.name=="code"){
      this.params =event.value
    }
    else if(parseInt(event.value)){
      this.code_options[event.name] = parseInt(event.value)
    }
    else{
      this.code_options[event.name] = event.value
    }
    this.authservice.getBar(this.params,this.code_options,0).subscribe((data:any)=>{
      this.svg = btoa(data)
      let objectURL = 'data:image/svg+xml;base64,' + this.svg;
      // this.image = this.sanitizer.bypassSecurityTrustUrl(objectURL);
      this.new_svg = this.sanitizer.bypassSecurityTrustUrl(objectURL);
      // this.dataContainer.nativeElement.innerHTML= data
      var img = new Image()
      img.src = objectURL
      if (img.width>0){
        this.img_width = img.width 
      }
    },error=>{
      if( error.status ==401){
        this.router.navigate(['/auth/login']);
        alert("Session Expired. Login to continue")
      }
    });
    this.router.navigate(['/auth/reports/'],{queryParams: {code:this.params,options: JSON.stringify(this.code_options) }});
    
  }
  generateCodes(code: any){
    // var width = this.get_layout(code.value.cols)[0]/this.img_width

    // console.log(this.get_layout(code.value.cols)[0])

    this.router.navigate(['/auth/reports/details'],{queryParams: {startcode:code.value.startcode, endcode:code.value.endcode, truncate:code.value.truncate,col: Math.round(code.value.cols),
                            options: JSON.stringify(this.code_options) }});
  }

   get_layout(width:any):any{
      
    if (width=='A4'){
      return this.paper_size.A4
    }
    if (width=='A3'){
      return this.paper_size.A3
    }
    if (width=='A5'){
      return this.paper_size.A5
    }
    if (width=="Letter"){
      return this.paper_size.Letter
    }
    if (width=="Legal"){
      return this.paper_size.Legal
    }
    if (width=="Executive"){
      return this.paper_size.Executive
    }
    if (width=="JIS B4"){
      return this.paper_size['JIS B4']
    }
    if (width=="JIS B5"){
      return this.paper_size['JIS B5']
    }
    if (width=="Tabloid"){
      return this.paper_size.Tabloid
    }
    else{
      return this.paper_size.Statement
    }

   } 
  // selectedOption(event: { target: { value: any; }; }){
    
  //   var temp = event.target.value;
  //   this.selectedValue =[];
  //   this.excludedlist=[];
  //   this.excludedProperty=undefined;
  //   if(temp == "Customer Status"){
  //     this.selectedValue= this.CustomerStatus;
  //     this.excludedProperty="Customer Status";
      
  //   }
  //   if(temp == "T/S Agent"){
  //     this.selectedValue= this.TSAgents;
  //     this.excludedProperty="T/S Agent";
      
  //   }
  //   if(temp == "Rating"){
  //     this.selectedValue= this.Plans;
  //     this.excludedProperty="Rating";
      
  //   }
  //   if(temp == "Note Status"){
  //     this.selectedValue= this.NoteStatus;
  //     this.excludedProperty="Note Status";
     
  //   }
  //   if(temp == "Issue Type"){
  //     this.selectedValue= this.IssueType;
  //     this.excludedProperty="Issue Type";
      
  //   }
  //   if(temp == "Modified by ID"){
  //     this.selectedValue= this.TSAgents;
  //     this.excludedProperty="Modified by ID";
      
  //   }
    
  // }
  // excludelist(event: { target: { value: any; }; }){
  //   this.excludedlist.push(event.target.value);
    
  // }
  // test(i: string | number,j: string | number){
  //   this.authservice.ReportDetails = this.RowTransformedDetails[i][j];
  //   this.router.navigate(['/auth/reports/details']);
    
  // }

  // fetchReport(report: { Match: { StartTime: Date; EndTime: Date; }; Rows: any; Columns: any; ColumnTotal: any; ExcludedProperty: any; Exclude: never[]; value: { [x: string]: Date; Rows: any; Columns: any; }; }){
  //   this.isLoading= false;
  //     if(report.Match){
  //         var QueryBuilder = report;
  //         if(typeof(QueryBuilder.Exclude)=="string"){
  //           var temp = QueryBuilder.Exclude;
  //           QueryBuilder.Exclude = [];
  //           QueryBuilder.Exclude.push(temp);
  //         }
  //         if(!QueryBuilder.Exclude){
  //           QueryBuilder.Exclude = [];
  //         }
          
  //         if(QueryBuilder.Module=="Notes"){
  //           this.showTSReport = true;
  //           this.showCustomerReport = false;
  //           this.selectedModule="Notes";
  //           this.RowsSelected = report.Rows;
  //           this.ColumnsSelected = report.Columns;
  //           this.ColumnTotal = report.ColumnTotal;
  //           this.excludedProperty = report.ExcludedProperty;
  //           this.startdate= report.Match.StartTime;
  //           this.enddate= report.Match.EndTime;
  //           this.excludedlist= report.Exclude;

  //           var temp = report.ExcludedProperty;
  //           this.selectedValue =[];
            
  //           if(temp == "Customer Status"){
  //             this.selectedValue= this.CustomerStatus;
  //             this.excludedProperty="Customer Status";
              
  //           }
  //           if(temp == "T/S Agent"){
  //             this.selectedValue= this.TSAgents;
  //             this.excludedProperty="T/S Agent";
              
  //           }
  //           if(temp == "Rating"){
  //             this.selectedValue= this.Plans;
  //             this.excludedProperty="Rating";
              
  //           }
  //           if(temp == "Note Status"){
  //             this.selectedValue= this.NoteStatus;
  //             this.excludedProperty="Note Status";
              
  //           }
  //           if(temp == "Issue Type"){
  //             this.selectedValue= this.IssueType;
  //             this.excludedProperty="Issue Type";
              
  //           }
  //           if(temp == "Modified by ID"){
  //             this.selectedValue= this.TSAgents;
  //             this.excludedProperty="Modified by ID";
              
  //           }
  //         }
  //         else  if(QueryBuilder.Module ==="Customer"){
            
  //           this.showCustomerReport = true;
  //           this.showTSReport = false;
  //           this.selectedModule="Customer";
  //           this.RowsSelected = report.Rows;
  //           this.ColumnsSelected = report.Columns;
  //           this.ColumnTotal = report.ColumnTotal;
  //           this.excludedProperty = report.ExcludedProperty;
  //           this.startdate= report.Match.StartTime;
  //           this.enddate= report.Match.EndTime;
  //           this.excludedlist= report.Exclude;
   
  //           var temp = report.ExcludedProperty;
  //           this.selectedValue =[];

  //           if(temp == "Customer Status"){
  //             this.selectedValue= this.CustomerStatus;
  //             this.excludedProperty="Customer Status";
             
  //           }
  //           if(temp == "T/S Agent"){
  //             this.selectedValue= this.TSAgents;
  //             this.excludedProperty="T/S Agent";
              
  //           }
  //           if(temp == "Rating"){
  //             this.selectedValue= this.Plans;
  //             this.excludedProperty="Rating";
             
  //           }
  //           if(temp == "Note Status"){
  //             this.selectedValue= this.NoteStatus;
  //             this.excludedProperty="Note Status";
              
  //           }
  //           if(temp == "Issue Type"){
  //             this.selectedValue= this.IssueType;
  //             this.excludedProperty="Issue Type";
              
  //           }
  //           if(temp == "Modified by ID"){
  //             this.selectedValue= this.TSAgents;
  //             this.excludedProperty="Modified by ID";
              
  //           }
  //         }
  //     }
  //     else{

  //       QueryBuilder = { Rows: report.value.Rows, Columns: report.value.Columns, Match: {StartTime: report.value["Start Time"], EndTime: report.value["End Time"]},ColumnTotal: report.value["Columns-Total"], Module: this.selectedModule, Exclude: this.excludedlist, ExcludedProperty: this.excludedProperty }
  //       this.router.navigate(['/auth/reports'],{ queryParams: { Rows: report.value.Rows, Columns: report.value.Columns, StartTime: report.value["Start Time"], EndTime: report.value["End Time"], ColumnTotal: report.value["Columns-Total"], Module: this.selectedModule, Exclude: this.excludedlist, ExcludedProperty: this.excludedProperty } });
  //       this.RowsSelected = report.value.Rows;
  //       this.ColumnsSelected = report.value.Columns;
  //       this.ColumnTotal = report.value["Columns-Total"];
  //       this.startdate= report.value["Start Time"];
  //       this.enddate= report.value["End Time"];
        
  //     }
      
  
  //   this.authservice.generateReport(QueryBuilder).subscribe(data=>{
      
  //     if(data=="invalid"){
  //       this.isLoading= true;
  //     }
  //     else{
  //       let TableColumn: any[] = [];
  //       let TableRow: any[] = [];
  //             data.forEach((element: { Columns: any[]; _id: { Rows: any; }; })=>{
  //               element.Columns.forEach((column: { Column: any; })=>{
  //                 TableColumn.push(column.Column);
  //             });
  //           TableRow.push(element._id.Rows);
  //       });
  
  //       let uniquearr = TableColumn.filter((a, i)=>{
  //         return TableColumn.indexOf(a) === i;
  //     });
  //       TableColumn = uniquearr;
  //       this.Columns = TableColumn;
  //       this.Rows = TableRow;
  //       let ColumnTransformedData: any[] = [];
  //       let RowTransformedData: any[][] = [];
  //       let index = 0;
  //       let rowTransformedDetails: any[][]=[];
  //       let colTransformedDetails: any[]=[];
  //       data.forEach((element: { Columns: string | any[]; ColumnTotal: any; })=>{
          
  //             ColumnTransformedData = [];
  //             colTransformedDetails=[];
  
  //                 for(let i=0;i<TableColumn.length;i++){
  //                     let counter =0;
  //                       for (let j=0;j<element.Columns.length;j++){
  
  //                           if(element.Columns[j].Column  === TableColumn[i] ){
  
  //                             ColumnTransformedData.splice(i,0,element.Columns[j].ColumnCount);
  //                             element.Columns[j].ColDetails["Status"]=TableColumn[i];
  //                             colTransformedDetails.splice(i,0,element.Columns[j].ColDetails);
                              
  //                             counter++;
  //                           }  
  //                       }  
                      
  //                     if(counter==0){
  //                       ColumnTransformedData.splice(i,0,'');
  //                       colTransformedDetails.splice(i,0,'');
  //                     }            
  //                 }  
  //             ColumnTransformedData.splice(0,0,this.Rows[index]);
  //             colTransformedDetails.splice(0,0,this.Rows[index]);      
  //             ColumnTransformedData.push(element.ColumnTotal);
  //             RowTransformedData.push(ColumnTransformedData);
  //             rowTransformedDetails.push(colTransformedDetails);
  //             index = index+1;
  //       });
  
  //       this.RowsData = RowTransformedData;
        
  //       let addRows: string[]=[];
  //         for(let i=0; i<this.RowsData.length;i++){
             
  //            for(let j=0; j<this.RowsData[i].length;j++){
  //               addRows[j] =  ((addRows[j])? (addRows[j]) : 0 ) + ((this.RowsData[i][j] !=='')?(this.RowsData[i][j]):0);
  //            }
           
  //         }
  //       addRows[0]='Total';
  //       this.RowsData.push(addRows); 
  //       this.RowTransformedDetails=rowTransformedDetails;
        
        
  //         this.isFiltered = true;
  //         this.isLoading= true;
  //     }
      

  //   },error=>{
  //         console.log(error);
  //         if(error.status == 0){
  //           this.flashmessage.show("Something went wrong. Try again", {cssClass: 'alert-danger', timeout: 3000});
  //         }
          
  //         if(error.json() === "Denied"){
  //           alert(`You can't generate reports from ${this.selectedModule} Module`);
            
  //         }
  //         else if(JSON.parse(error._body).name =="JsonWebTokenError" || JSON.parse(error._body).name=="TokenExpiredError"){
  //           localStorage.clear();
  //           this.router.navigate(['/auth/login']);
  //           this.flashmessage.show("Session Expired. Login to continue", {cssClass: 'alert-danger', timeout: 3000});
  //         }
          
          
        
  //   });
  // }


  
}

