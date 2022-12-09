// import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';
import { AuthService } from './../../auth.service';
import { NgForm,FormGroup, FormControl, FormArray, FormBuilder } from '@angular/forms';
import { Component, OnInit, ElementRef } from '@angular/core';
import { DatepickerOptions } from 'ng2-datepicker';
import * as moment from 'moment';

@Component({
  selector: 'app-new-customer',
  templateUrl: './new-customer.component.html',
  styleUrls: ['./new-customer.component.css']
})
export class NewCustomerComponent implements OnInit {
  productForm:FormGroup;
  HelpIcon = ['','Pass', 'Fail'];
  Plans = ['','N/A',"12 Months", "OTF", "6 Months","18 Months","24 Months"];
  ESign =["Sales Call","Service Call","Others"];
  callOptions=["","Sales Call","Service Call","Others"];
  Sale=["","Spectrum","AT&T","Direct TV","Visat","Frontier","Century Linik","Others"];
  PaymentGateway=["","Bad Credit","UpFront Payment","Service Not Available","Already has a service","Not Interested","Cannot Afford","Interested Need to Followup","Sale Not Confirmed Requires Followup", "Others"];
  currentAgentName:any;
  TSAgents =  ['','N/A','Shibin', 'Shiva Kumar', 'Kausik M', 'Karthik J', 'Vijay Kumar','Abhijit Ghosh', 'Bharat Patel','Nitin Vasudev'];
  CustomerStatus = ['','Need Follow-Up',"Interested Need to Followup","Sale Not Confirmed Requires Followup","Sale Confirmed","No Sale","Bad Credit","UpFront Payment","Service Not Available"];
  SalesAgents =["","Bhuvan Kashetty",
  "Arjun Anirudhan",
  "Adithya Prabhu",
  "Deepthi Priya C",
  "R. Laldintluanga",
  "Nikita Chauhan",
  "Syed Mujahid",
  "M. N. Reshma Raj",
  "Subeeya Tranum",
  "Shivil C. P",
  "Chandana N. Nayak",
  "Binod Behura",
  "Meghavardhan S",
  "Princey T. A",
  "John Anthony Raj K",
  "Padmaja K",
  "Sutabh Talukder"
   ];
  Salutation = ['Mr.','Mrs.','Dr.', "Prof.","Ms."];
  newFieldsList =[''];
  isCustomerCreated:any;
  isCheckBoxChecked:any;
  isNewFieldClicked:any;
  previousCheckBox:any;
  presentCheckbox:any;
  showOptions=false;
  saleSelected:any;
  noSale:any;
  temp:any;
  new_field_data =[];

  // options: DatepickerOptions = {
  //   minYear: 1970,
  //   maxYear: 2030,
  //   displayFormat: 'MMM DD YYYY',
  //   barTitleFormat: 'MMMM YYYY',
  //   firstCalendarDay: 0 // 0 - Sunday, 1 - Monday
  // };

date: Date;
  constructor(private authService: AuthService,  private router: Router, private fb:FormBuilder) {
    this.date = new Date;
    this.productForm = this.fb.group({
      newfields: this.fb.array([]),
    });
   }
 
  ngOnInit() {
    this.isNewFieldClicked = false;
     this.isCustomerCreated = false;
     this.isCheckBoxChecked = false;
     this.presentCheckbox = null;
     this.previousCheckBox = null;
     this.showOptions = false;
     this.saleSelected = null;
     this.noSale = true;
     this.currentAgentName = localStorage.getItem('Name') || [];
  }

  quantities() : FormArray {  
    return this.productForm.get("newfields") as FormArray  
  }  

  newQuantity(): FormGroup {  
    return this.fb.group({  
      key: '',  
      value: '',  
    })  
  }  

  addQuantity() {  
    this.quantities().push(this.newQuantity());  
  }  

  removeQuantity(i:number) {  
    this.quantities().removeAt(i);  
  }   

  onSubmit() {  
    console.log(this.productForm.value);  
  }  

  createCustomer(userForm: NgForm){
       this.isCustomerCreated = true;
      
      const userInfo = userForm.value;
      console.log(userInfo)
      // const DateFormat = userInfo["Time"];
      userInfo["Customer Owner ID"] = this.currentAgentName;

      // var timestamp = this.UnixTimeFormatter(DateFormat);      
      // var FormattedDate = this.TimeStampToDateFormatter(timestamp);
      userInfo["Time"] = new Date();

      this.authService.submitNewCustomer(userInfo).subscribe((createdUser:any)=>{
            console.log(createdUser)
            setTimeout(()=> {
              this.isCustomerCreated = false;
            
              var params = createdUser["_id"];
                       
              this.router.navigate(['/auth/show', params]);
            }, 10);

          },(error)=>{
            
            console.log(error); 
            if(error.json() === "Denied"){
              
              this.router.navigate(['/auth/leads']);
              alert("You don't have permission to Create Customers")
              // this.flashmessage.show("You don't have permission to Create Customers", {cssClass: 'alert-danger', timeout: 3000});
            }
            else{
              this.router.navigate(['/auth/login']);
              this.authService.isLoggedIn = false;
              alert("Session Expired. Login to continue")
              // this.flashmessage.show("Session Expired. Login to continue", {cssClass: 'alert-danger', timeout: 3000});
              localStorage.clear();
            }
      });
 
  }

  UnixTimeFormatter(DateFormat:any){
    var date = moment(DateFormat).format(),
    timestamp = moment(date).format("x");
    return parseInt(timestamp);
  }

  TimeStampToDateFormatter(timestamp:any){

    var todate=new Date(timestamp).getDate();
    var tomonth=new Date(timestamp).getMonth()+1;
    var toyear=new Date(timestamp).getFullYear();
    
    var original_date = tomonth+'/'+todate+'/'+toyear;

    return original_date;
  }
  cancelCustomer(){
    this.router.navigate(['/auth/leads']);
  }
  checkboxclicked(selecteditem:any){

      if(selecteditem.value ==="Sales Call")
    {
      this.showOptions = true;
    }
    else{
      
      this.showOptions = false;
    }
 

  }
  salesChecked(selecteditem:any){
    if(selecteditem.value =="Yes"){
      this.saleSelected = true;
      this.noSale = false;
    }
    else {
      this.noSale = true;
      this.saleSelected = false;
    }
  }

  newFields(){
    this.isNewFieldClicked = true;
    console.log('here')
  }
  addDone(data:NgForm){
    console.log(data.value)
    this.isNewFieldClicked = false;
    // this.new_field_data.push(data.value['newField'])
    console.log(this.new_field_data)
  }

  cancelAdd(){
    console.log('here again')
    this.isNewFieldClicked= false
  }
}
