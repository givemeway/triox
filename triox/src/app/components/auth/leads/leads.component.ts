// import { FlashMessagesService } from 'angular2-flash-messages';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AuthService } from './../../auth.service';
import { Component, OnInit, ElementRef, Renderer2, Injectable } from '@angular/core';
import * as moment from 'moment';
import { AnyAaaaRecord } from 'dns';
@Injectable()
@Component({
  selector: 'app-leads',
  templateUrl: './leads.component.html',
  styleUrls: ['./leads.component.css']
})
export class LeadsComponent implements OnInit {

constructor(private authService: AuthService, private router: Router, public render: Renderer2, public elRef: ElementRef, public route: ActivatedRoute) { }
leads: string[] = [];
totalCount:any;
page:any;
index:any;
noPreviousPage:any;
fromIndex:any;
toIndex:any;
loading:any;
showEdit:any;
selectedLead:any;
isCheckBoxChecked:any;
deviceParams:any
sortorder = -1;
sortelement="Time";
  ngOnInit() {
            this.showEdit = false;
            this.sortorder = -1;
            this.sortelement = "Time";
            this.selectedLead = [];
            this.noPreviousPage = true;
            this.isCheckBoxChecked = false;
            this.loading = true;
            this.route.queryParams.subscribe((params: Params)=>{
              if(params['Page']){
                this.page = params['Page'];
                this.index = params['Index'];
                this.sortorder= params['Sortorder'];
                this.sortelement= params['Name'];
                this.fromIndex = this.page*this.index - (this.index -1);
                this.toIndex = this.page*this.index;
                this.getLeadsByPageIndex(this.page, this.index,this.sortorder,this.sortelement);
              }
              else{
                this.page = 1;
                this.index = 10;
                this.fromIndex = this.page*this.index - (this.index -1);
                this.toIndex = this.page*this.index;
               
                this.router.navigate(['/auth/leads'], {queryParams: { Page: this.page, Index: this.index, Name: this.sortelement,Sortorder:this.sortorder}});
                // this.getLeadsByPageIndex(this.page, this.index,this.sortorder,this.sortelement);
              }
              
            });
            
            
      }

    getJson(string_array:any){
      this.deviceParams = {}
        for (let i=0;i<string_array.length;i++){
          var _tab_sv = string_array[i].split('\t')
          var _tab_data = []
          for (let j=0; j<_tab_sv.length; j++){
            if(_tab_sv[j].length!=0){
              _tab_data.push(_tab_sv[j].trim())
            }
          }
          if(_tab_data.length==1){
            if(_tab_data[0].search('MAC ADDRESS:')!=-1){
              this.deviceParams['MAC ADDRESS'] = _tab_data[0].split("MAC ADDRESS:").slice(-1)[0]
            }
            else if (_tab_data[0].search('Ultrasound')!=-1){
              this.deviceParams['Ultrasound Params'] = _tab_data[0].split("Ultrasound =").slice(-1)[0]
            }
                        
          }
          else if(_tab_data.length==2){
            this.deviceParams[_tab_data[0].trim()] = _tab_data[1]
          }
          else if(_tab_data.length==2){
            this.deviceParams[_tab_data[0].trim()] = _tab_data.slice(1)
          }
              
        }

      return this.deviceParams

    }  
    getLeadsByPageIndex(page:any, index:any,sortorder:any,sortelement:any){
     
        this.authService.getLeads(page, index,sortorder,sortelement).subscribe((Leads:any)=>{
            var leads = Leads.docs;
            this.leads = []
            this.totalCount = Leads.count;
            setTimeout(()=>{
              for(let i=0;i<leads.length;i++){
                // leads[i]["Created Time"] = new Date((leads[i]["Created Time"])).toLocaleString(); 
                leads[i]["Time"] = moment(leads[i]["Time"]).format('MMMM Do YYYY, h:mm:ss a');
                // leads[i]["Time"] = moment(leads[i]["Time"]).startOf('seconds').fromNow();
              }
              // this.leads = leads;
              this.loading = false;
              for(let i=0;i<leads.length; i++){
                try{
                  var output_object = this.getJson(leads[i]['Output'].split("\n"))
                  output_object._id = leads[i]._id
                  output_object.Time = leads[i].Time
                  this.leads.push(output_object)
                }
                catch(err){
                  this.leads.push(leads[i])
                }
              }

            }, 10);
          },(error:any)=>{
                console.log(error);
                localStorage.clear();
                this.router.navigate(['/auth/login']);
                this.authService.isLoggedIn = false;
                alert("Session Expired. Login to continue")
                // this.flashmessage.show("Session Expired. Login to continue", {cssClass: 'alert-danger', timeout: 2000});        
        });
    }  

    recordsPerpage(event:any){
      this.index = parseInt(event.target.value);
      this.fromIndex = this.page*this.index - (this.index -1);
      this.toIndex = this.page*this.index;
      this.loading = true;
      this.router.navigate(['/auth/leads'], {queryParams: { Page: this.page, Index: this.index, Name: this.sortelement,Sortorder:this.sortorder}});
      // this.getLeadsByPageIndex(this.page, this.index,this.sortorder,this.sortelement);
      
    }
    nextPage(){
      this.page = parseInt(this.page) + 1;
      this.index = parseInt(this.index);
      this.noPreviousPage = false;
      this.loading = true;
      this.fromIndex = parseInt(this.page)*parseInt(this.index) - (parseInt(this.index) -1);
      this.toIndex = parseInt(this.page)*parseInt(this.index);
      this.router.navigate(['/auth/leads'], {queryParams: { Page: this.page, Index: this.index, Name: this.sortelement,Sortorder:this.sortorder}});
      // this.getLeadsByPageIndex(this.page, this.index);
    }
    previousPage(){
      this.page = this.page - 1;
      if(this.page <= 0){
          this.noPreviousPage = true;
          
      }
      else{
        
        if(this.page ===1){
          this.noPreviousPage = true;
        }
        this.loading = true;
        this.fromIndex = this.page*this.index - (this.index -1);
        this.toIndex = this.page*this.index;
        this.router.navigate(['/auth/leads'], {queryParams: { Page: this.page, Index: this.index, Name: this.sortelement,Sortorder:this.sortorder}});
        // this.getLeadsByPageIndex(this.page, this.index);
      }
      
    }
    refresh(){
     
      this.loading = true;
      this.selectedLead = [];
      this.getLeadsByPageIndex(this.page, this.index,this.sortorder,this.sortelement);
    }
  saveAs(fileTitle:any,blob:any){
    var exportedFilename = fileTitle + '.xlsx' || 'download.xlsx';

    var link = document.createElement("a");
    if (link.download !== undefined) { // feature detection
        // Browsers that support HTML5 download attribute
        var url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", exportedFilename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

          }
      }

    uncheck(){
      var checkboxes = document.querySelectorAll('input[type="checkbox"]')
      console.log(checkboxes[0])
    }

    download(){
      this.authService.getDevices(this.selectedLead).subscribe((blob)=>{
        this.saveAs('Download',blob)
        this.showEdit = false;
        this.selectedLead = [];
        this.isCheckBoxChecked = false;
        },
        (error)=>{console.log(error)
        });
    }
    cancel(){
      this.showEdit = false;
      this.selectedLead = [];
      this.isCheckBoxChecked = false;
      this.uncheck()
    }
    checkboxclicked(seleceteditem:any){
          this.showEdit = true;

          if(seleceteditem.checked){
            this.selectedLead.push(seleceteditem.value);
          }
          else{
            for(let i=0; i<this.selectedLead.length; i++){
                  if(this.selectedLead[i]===seleceteditem.value){
                    this.selectedLead.splice(i,1);
                  }
            }
            
          }
          
          if(this.selectedLead.length ==0){
            this.showEdit = false;
          }
    }
    deleteLead(){
      this.authService.deletelead(this.selectedLead).subscribe((deleteditem:any)=>{
        this.showEdit = false;
        this.selectedLead = [];
        alert("Successfully Deleted")
        this.getLeadsByPageIndex(this.page, this.index,this.sortorder,this.sortelement);}, 
        (error:any)=>{
        console.log(error);

        if(error.json() === "Denied"){
          this.showEdit = false;
          alert("You don't have permission to delete");
          this.getLeadsByPageIndex(this.page, this.index,this.sortorder,this.sortelement);
          
        }
        else{
          localStorage.clear();
          this.router.navigate(['/auth/login']);
          this.authService.isLoggedIn = false;
          alert("Session Expired. Login to continue")
        }
      });
    }

    sortlist(sortelement:any){
       if(this.sortorder == -1){
         this.sortorder = 1;
       
       }
       else{
        this.sortorder = -1;
       }
       this.sortelement = sortelement;
 
      this.router.navigate(['/auth/leads'], {queryParams: { Page: this.page, Index: this.index, Name: this.sortelement,Sortorder:this.sortorder}});
    
    }
}
