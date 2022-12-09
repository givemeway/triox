import { AuthService } from './../../../auth.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Component, OnInit,Injectable,ViewChild, ElementRef } from '@angular/core';
// import jsPDF from 'jspdf';
import * as pdfMake from 'pdfmake/build/pdfmake.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';
var htmlToPdfmake =require('html-to-pdfmake') ;
import { Options } from '@angular-slider/ngx-slider';
import { ThrowStmt } from '@angular/compiler';
import { ReportsComponent } from '../reports.component';
import { DomSanitizer } from '@angular/platform-browser';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable()
@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
  providers: [ReportsComponent]
})
export class DetailsComponent implements OnInit {
  ReportRowData:any;
  isSales:any;
  isGenerate= false;
  @ViewChild('pdfTable')
  pdfTable!: ElementRef<any>;
  cols_list:any;
  code_options:any;
  startcode:any;
  endcode:any;
  svg_list:any;
  rows_columns_list:any;
  truncate:any;
  columns:any;

  public downloadAsPDF() {
    // const doc = new jsPDF();
   
    const pdfTable = this.pdfTable.nativeElement;
    
    var html = htmlToPdfmake(pdfTable.innerHTML);
    var img = htmlToPdfmake(`<img src="https://picsum.photos/seed/picsum/200">`, {
      imagesByReference:true
    });
    const documentDefinition = { content: html };
    var svgDefinition = { content : [
                              html, { svg: '<svg width="300" height="200" viewBox="0 0 300 200">...</svg>' }
                                ]}
    pdfMake.createPdf(svgDefinition).download("barcodes.pdf"); 
    
  }   
  constructor(public authservice: AuthService, public sanitizer:DomSanitizer, public reports: ReportsComponent,private router: Router,public route: ActivatedRoute) { }

  ngOnInit() {
    this.columns =4
    
    this.route.queryParams.subscribe((params: Params)=>{
        this.code_options = JSON.parse(params['options'])
        this.reports.code_options = JSON.parse(params['options'])
        this.startcode = params['startcode']
        this.endcode = params['endcode']
        this.truncate = params['truncate']
        this.columns = params['col']
        this.isGenerate=true
        this.generateCodes()
    });
  }


  generateCodes(){
    // var start = this.parse_name_number(this.startcode)
    // var end = this.parse_name_number(this.endcode)
      
    var code_list = this.get_series(this.startcode,this.endcode)
    this.authservice.getBar(code_list,this.code_options,this.truncate).subscribe((data:any)=>{
      
      var temp
      this.svg_list =[]
      this.rows_columns_list =[]
      for(let i=0;i<data.length;i++){
        let objectURL = 'data:image/svg+xml;base64,' + btoa(data[i]);
        temp = this.sanitizer.bypassSecurityTrustUrl(objectURL);
        // temp = this.sanitizer.bypassSecurityTrustHtml(data[i]);
        // temp = this.sanitizer.bypassSecurityTrustHtml(data[i]);
        this.svg_list.push(temp);
        
      }
      this.rows_columns_list = this.create_2D_array(this.svg_list,parseInt(this.columns));   
      // this.router.navigate(['/auth/reports/details'],{queryParams: {startcode: this.startcode,endcode:this.endcode,truncate: this.truncate,options: JSON.stringify(this.code_options),col:this.columns}});                                                         
    },error=>{
      console.log(error);
      if(error.status == 500){
        alert("Something went wrong. Try again")
        // this.flashmessage.show("Something went wrong. Try again", {cssClass: 'alert-danger', timeout: 3000});
      }
      
      else if(JSON.parse(error._body).name =="JsonWebTokenError" || JSON.parse(error._body).name=="TokenExpiredError"){
        localStorage.clear();
        this.router.navigate(['/auth/login']);
        alert("Session Expired. Login to continue")
        // this.flashmessage.show("Session Expired. Login to continue", {cssClass: 'alert-danger', timeout: 3000});
      }});
  }

  create_2D_array(onedarray: string | any[],columns: number){

  var twodarray = []  
  var rows =  Math.round(onedarray.length / columns);

 
  var init =0
  var offset = columns
  for( let i=0;i<onedarray.length;i++){
      
      if (i %columns ==0){
          
          twodarray.push(onedarray.slice(init,offset))
          init = offset;
          offset = init + columns;
          
      }
      else{
          continue
      }
  
     }   

return twodarray
}

parse_name_number(code: string | any[]){

    var name = this.splice_digits(code)
    return [name[1],name[0]]
  }
  
get_series(start_code: any,end_code: any){

    var start = this.splice_digits(start_code)
    var end = this.splice_digits(end_code)
    var start_number = start[0]
    var end_number = end[0]
    var code_list = []
    if(start[1]==end[1]){
      if( parseInt(start_number) < parseInt(end_number)){
        const count = parseInt(end_number) - parseInt(start_number) 
        for( let i =0;i<=count;i++){
            code_list.push(this.iterate_board_name(start_code,i))
        }
        
      }
    }
    else{
      this.router.navigate(['/auth/reports/']);
      alert("Invalid series")
    }
    return code_list
  }


splice_special_characters(full_name: string){ 
    
    var split_hypen = full_name.split("-")
    var rebuilt_name =[]
    for (const [i,_] of split_hypen.entries()){ 

        if (_.includes("_")){
            var data = _.split("_")
            for ( const[i,_] of data.entries()){
                rebuilt_name.push(_)
            }  
         }
            
        else{ 
            // console.log(_)
            rebuilt_name.push(_)
        }
            
        
            
    }
    var name =""
    for(const [i,_] of rebuilt_name.entries()){
         
            name = name + _
        }
        
    return name

}

splice_digits(full_name: string | any[]){ 
    var name = ''
    var number= ''

        for (let i=0;i<full_name.length;i++){
       
                // console.log(full_name[i])
                if(parseInt(full_name[i])){ 
                    
                    number = number + full_name[i]
                }
                else if (parseInt(full_name[i])==0) {
                    number = number + full_name[i]
                }
                else{
                    name = name + full_name[i] 
                }
   
         }
        var list = [number,name] 
        return list

}

find_indexes(full_name: string | any[]){ 
    var indexes_list=[]
    for ( let i=0;i<full_name.length;i++){
        
        if (full_name[i] == "-"){indexes_list.push(["-",i]) }

        
        else if (full_name[i] =="_"){indexes_list.push(["_",i]) }
            
            
        if (parseInt(full_name[i])){ indexes_list.push ([full_name[i],i])}
        else if (parseInt(full_name[i])==0){indexes_list.push ([full_name[i],i])}
                
     }
                
    return indexes_list
 }

    
rebuild_original(board_name: String,idx: any[]){

    var rebuilt_name= board_name
        for(const[_,item] of idx.entries()) { 
            rebuilt_name =  rebuilt_name.slice(0, parseInt(item[1])) + String(item[0]) + rebuilt_name.slice(parseInt(item[1]));
   
        }


        return rebuilt_name
 }


mutate_idx(old_idx: any[],new_idx: any[]){
    var j = 0
    for (const [i,item] of old_idx.entries()){ 
        const key = old_idx[i][0]
        try{ 
            if (parseInt(key)){

                old_idx[i][0] = new_idx[j][0]
                j+=1
            }
            else if ( parseInt(key)==0 ){
                old_idx[i][0] = new_idx[j][0]
                j+=1
            }
            
        }
            
        catch{ 
            continue
        }
           
    }
       

    return old_idx

 }

iterate_board_name(full_name: any,increment: number){ 
    var no_sp_char = this.splice_special_characters(full_name)
    var name = this.splice_digits(no_sp_char)
    var board_number = name[0]
    var board_name = name[1]
    var to_number = parseInt(board_number) + increment
    var string_len = board_number.length
    var number_len = String(to_number).length
    var new_to_number =String(to_number)
    if (number_len != string_len){
        var zeroes_to_add = string_len - number_len
        var zeroes_text =""
        for (let i=0;i<zeroes_to_add;i++){ 
            zeroes_text = "0"+zeroes_text
        }
            
        new_to_number = zeroes_text +String(to_number)

     }

    board_number = new_to_number
    name= this.splice_digits(board_name+board_number)
    board_name = name[1]
    board_number = name[0]
    var old_idx = this.find_indexes(full_name)
    var new_idx = this.find_indexes(board_name+board_number)
    var idx = this.mutate_idx(old_idx,new_idx)
    var rebuilt_name = this.rebuild_original(board_name,idx)

    return rebuilt_name
}
  
}

