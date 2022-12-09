import { InlineeditComponent } from './../../../inlineedit/inlineedit.component';
import { ReadMoreComponent } from './../../../read-more/read-more.component';
// import { FlashMessagesService } from 'angular2-flash-messages';
import { SearchComponent } from './../search.component';
import { AuthService } from './../../../auth.service';
import { Component, OnInit,Input, Output, EventEmitter, HostListener,Renderer2,ElementRef,OnChanges,Injectable }  from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { HttpClient , HttpHeaders , HttpResponse } from '@angular/common/http';
import {Observable,throwError} from 'rxjs';
import { FormsModule , NgForm, FormGroup, FormBuilder,Validators} from "@angular/forms";
import * as _ from 'lodash';
import { DatepickerOptions } from 'ng2-datepicker';
import * as moment from 'moment';
import { AnyKeys } from 'mongoose';

@Injectable()
@Component({
  selector: 'app-showcustomer',
  templateUrl: './showcustomer.component.html',
  styleUrls: ['./showcustomer.component.css']
})
export class ShowcustomerComponent implements OnInit  {
  params!: String;
  isFileAttached:any;
  isUploadStarted!: boolean;
  isUploadComplete: any;
  Images:any;
  results:any;
  otherfields:any;
  notesFound!: number;
  notes:any;
  Note: any = {};
  activeNoteTemp: any;
  activeNote!: boolean;
  isShowMore!: boolean;
  editableText: any;
  editedData: any;
  isEdit= false;
  public isDisplay = true;
  isNewNotesClicked = false;
  isfetchAllNotes = false;
  currentAgentName:any;
  isFileAdded=false;
  previewURL!: string;
  temp: number | undefined; 
  isSale!: boolean | null;
  isSaleConfirmed!: boolean | null;
  EditedForm!: FormGroup;
  HelpIconStatus = ['Yes', 'No'];
  PlanDuration = ['N/A',"12 Months", "OTF", "6 Months","18 Months","24 Months"];
  ESign =["Sales Call","Service Call","Others"];
  Sale=["N/A","Spectrum","AT&T","Direct TV","Visat","Frontier","Century Linik","Others"];
  PaymentGateway=["N/A","Bad Credit","UpFront Payment","Service Not Available","Already has a service","Not Interested","Cannot Afford","Interested Need to Followup","Sale Not Confirmed Requires Followup", "Others"];
  TSAgents =  ['N/A','Shibin', 'Shiva Kumar', 'Kausik M', 'Karthik J', 'Vijay Kumar','Abhijit Ghosh', 'Bharat Patel','Nitin Vasudev'];
  CustomerStatus = ['Need Follow-Up',"Interested Need to Followup","Sale NOT Confirmed Requires Followup","Sale Confirmed","No Sale"];
  NoteStatus =['','Need Follow-Up',"Interested Need to Followup","Sale NOT Confirmed Requires Followup","Sale Confirmed","No Sale"];  
  SalesAgents =["N/A","Bhuvan Kashetty",
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
  IssueType = ['',
    "Apple Mac Operating System",
    "Browsers/Websites",
    "Computer Peripherals/Drivers (Printer/USB/Camera/Keyboard/Mouse/…)",
    "Hardware Issue",
    "Information Chat",
   "Malware Removal",
   "Microsoft Office Outlook",
    "Microsoft Office Suite",
   "Mobile Devices",
   "Network",
    "Other Email clients",
    "Third Party Software",
    "WebMail",
   "Windows Operating System",
    "Windows Updates"
    ] ;

    options: DatepickerOptions = {
      minYear: 1970,
      maxYear: 2030,
      // format: 'MMM DD YYYY',
      // formatTitle: 'MMMM YYYY',
      firstCalendarDay: 0, // 0 - Sunday, 1 - Monday
      // calendarClass: 'datepicker-blue',
      // scrollBarColor: '#ffffff'
    };
  
  date: Date;

  constructor(private formBuilder: FormBuilder, private elRef:ElementRef, private route: ActivatedRoute, 
    private router: Router, private http: HttpClient, public authService: AuthService, public renderer: Renderer2) 
    { 
    this.date = new Date;
  }
  testContent = []
  ngOnInit() {
    this.temp=NaN;
    this.otherfields =[]
    this.isUploadStarted=false;
    this.isSale=null;
    this.activeNote=false;
    this.isSaleConfirmed=null;
    this.Images=[];
    this.notesFound = 0;
    this.isShowMore = false;
    this.isfetchAllNotes = false;
    this.results = {};
    this.isNewNotesClicked = false;
    this.isFileAdded=false;
    this.currentAgentName = localStorage.getItem('Name');
    this.params = this.route.snapshot.params['customer'];
    this.getUserDetails(this.params);
  }
  ngOnChanges(){
    
  }

  editDone(newText: any): void {
      
      var pickedProperty: any
      if (newText.value){
        pickedProperty = Object.keys(newText.value)[0];
        console.log(pickedProperty)
        console.log(newText.value)
        // format input date string to time stamp
        if(pickedProperty === "Time"){

          var date = moment(newText.value["Time"]).format(),
          timestamp = moment(date).format("x");
          var editedData = newText.value;
          var todate = new Date(parseInt(timestamp)).getDate();
          var tomonth = new Date(parseInt(timestamp)).getMonth()+1;
          var toyear = new Date(parseInt(timestamp)).getFullYear();

          var original_date = tomonth+'/'+todate+'/'+toyear;

          newText.value[pickedProperty] = original_date;
          editedData = newText.value[pickedProperty]
        }
        else{
          var editedData = newText.value;
          editedData = editedData[pickedProperty]
        }
      }
      else{
        pickedProperty = ["DeviceTestInfo",newText.key]
        var editedData = newText;
        this.otherfields[newText.key].editFieldName = null;
      }
      
      // function to update customer details in backend
      this.authService.getClientIP().subscribe(IPDetails=>{  
            this.authService.updateUser(this.params, editedData, pickedProperty,this.currentAgentName,IPDetails ).subscribe((data:any)=>{
            
            //reset the inline edit
            this.temp = undefined;
            this.results = data.updaterecords;
            //refresh view
            this.getUserDetails(this.params);
            
          }, error=>{
            console.log(error)
            if(error.json() === "Denied"){
              this.temp = undefined;
              alert("You don't have permission to edit this field");
            }
            else{
              this.router.navigate(['/auth/login']);
              this.authService.isLoggedIn = false;
              alert("Session Expired. Login to continue")
            }
    
          });

      },error=>{
        alert("something went wrong. try again");
      });     
  }

  getUserDetails(params: String){
      this.authService.getClientIP().subscribe( body=>{
              
              this.authService.getUserById(params, body).subscribe((result:any)=>{
                result.searchResults["Time"] = moment(result.searchResults["Time"]).format('MMMM Do YYYY, h:mm:ss a');
                //update customer show page
                this.results = result.searchResults;
                this.otherfields = []
                for ( let i=0;i<this.results["DeviceTestInfo"].length;i++){   
                  try{
                   
                      var temp_value: any
                      temp_value = this.results["DeviceTestInfo"][i]
                      temp_value.editFieldName = null
                      temp_value.key = i
                      this.otherfields.push(temp_value)
                  }
                  catch(err){
                    continue
                  }  
                    
                }
                this.getUserNotes(this.params, false);
                
            }, (error)=>{
              console.log(error);
              this.router.navigate(['/auth/login']);
              this.authService.isLoggedIn = false;
              alert("Session Expired. Login to continue")
            });

      },
      error=>{
        console.log(error);
        alert("something went wrong. try again");
      });

  }
  getUserNotes(ParentID: String, isGetAllNotes: boolean){
      this.authService.getUserNotes(ParentID,isGetAllNotes).subscribe((notes:any)=>{
          var date;
          for(let i=0;  i<notes.NoteResults.length; i++){
            // date = new Date((notes.NoteResults[i]["Modified Time"])).toLocaleString();

            date = moment(notes.NoteResults[i]["Modified Time"]).format('MMMM Do YYYY, h:mm:ss a');

            notes.NoteResults[i]["Modified Time"] = date;
            this.notes.push(notes.NoteResults[i]);
          }
          
           this.notesFound = notes.totalNotesFound; 
        
      }, (error)=>{
        
        this.router.navigate(['/auth/login']);
        this.authService.isLoggedIn = false;
        alert("Session Expired. Login to continue")
        // this.flashmessage.show("Session Expired. Login to continue", {cssClass: 'alert-danger', timeout: 3000});
      });
  }

  cancelEdit(value: any){
    this.temp = undefined;
  }

  isEdited(value: any){
    this.temp = value;
  }

  newNotes(){
    this.isNewNotesClicked = !this.isNewNotesClicked;
  }

  addNewNotes(editedNotes: NgForm){
    console.log(editedNotes.value)
    if(editedNotes.value['Attachment']){
      // var isFileAttached = this.getAttachmentData(1);
    }

    if(editedNotes.value["Note Content"]&&editedNotes.value["Note Status"] ){

         var Notes = { content: editedNotes.value["Note Content"],
                       status : editedNotes.value["Note Status"],
                      //  issueType:  editedNotes.value["Issue Type"],
                      //  issueDescription: editedNotes.value["Issue Description"],
                      //  steps: editedNotes.value["TroubleShooting Steps"]
                  }
      this.isNewNotesClicked=false;
      this.authService.addNotes(this.params, Notes, this.currentAgentName).subscribe((createdNotes)=>{ 
        this.Note = createdNotes;
        this.notes=[];
        this.Note = [];
        // if(isFileAttached){
        //   this.uploadFile(isFileAttached.inputEl,isFileAttached.fileCount, isFileAttached.formData, createdNotes._id,isFileAttached.photo);
        // }
        // this.getUserDetails(this.params);
        this.getUserNotes(this.params,false);
      },(error)=>{ 
        localStorage.clear();
        this.router.navigate(['/auth/login']);
        this.authService.isLoggedIn = false;
        alert("Session Expired. Login to continue")
        // this.flashmessage.show("Session Expired. Login to continue", {cssClass: 'alert-danger', timeout: 3000});
      });

    }
    else{
      alert('fields cant be empty');
    }
      
  }

  showmore(){
    this.isShowMore = true;
  }
  fetchAllNotes(){
    this.isfetchAllNotes = true;
    this.notes = [];
    this.getUserNotes(this.params, true);

  }
  UpdateView(event: any){
    
  }
  noteeditDone(editedNotes: NgForm, noteID: any){
    console.log(typeof(editedNotes));
    if(editedNotes.value['Attachment']){
     
      if(this.temp){
        // var isFileAttached = this.getAttachmentData(2); 
      }
      else {
        // var isFileAttached = this.getAttachmentData(3); 
      }
      
      ;
    }
    console.log(editedNotes.value['Attachment'],"notes: ",editedNotes.value["Note Content"]);
    const EditedNotes = editedNotes.value["Note Content"];
   
    if(EditedNotes){
      this.temp = undefined;
      editedNotes.value.ParentID = this.params;
      this.authService.editNotes(noteID, editedNotes.value).subscribe((notes)=>{
        
        this.notes=[];
        
        // if(isFileAttached){
        //   continue
          // this.uploadFile(isFileAttached.inputEl,isFileAttached.fileCount, isFileAttached.formData, noteID,isFileAttached.photo);
          // console.log("file uploaded");
          // console.log(notes);
        // }
        // this.getUserDetails(this.params);
        this.getUserNotes(this.params,false);
      },
      error=>{
  
          if(error.json() === "Denied"){
            this.temp = undefined;
            alert("You can't edit Notes Created by Other Agents");
            
          }
          else{
            localStorage.clear();
            this.router.navigate(['/auth/login']);
            this.authService.isLoggedIn = false;
            alert("Session Expired. Login to continue")
            // this.flashmessage.show("Session Expired. Login to continue", {cssClass: 'alert-danger', timeout: 3000});
          }
  
      });
    }
    // else if(!EditedNotes && isFileAttached){
    //   this.uploadFile(isFileAttached.inputEl,isFileAttached.fileCount, isFileAttached.formData, noteID, isFileAttached.photo);
    //   console.log("file uploaded");
    // }
    else{
      alert("Notes Can't be Empty");
    }
  }

  retrieveimage(NoteID: any){
   
    const URL = "/auth/fileretrieval";
    var body = {parentid: this.params, noteid: NoteID};
    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    return new Promise((resolve, reject)=>{

        this.http.post(URL, body, {headers: headers})
        .pipe((data:any)=>{ return data.json()})
        .subscribe((Data: unknown)=>{resolve(Data); }, (error: any)=>{console.log(error); reject(error);
        });

    });

  }
  onEdit(item: any,key:string) {
    item.editFieldName = item.key
  }
  close(item: any) {
    item.editFieldName = null;
  }

  // getAttachmentData(photo: string | number){
  //   let inputEl: HTMLInputElement = this.elRef.nativeElement.querySelector('#photo'+photo);
  //   //get the total amount of files attached to the file input.
  //       let fileCount: number = inputEl.files.length;
  //   //create a new fromdata instance
  //       let formData = new FormData();

  //       return {inputEl,fileCount, formData, photo};
  // }
  // uploadFile(inputEl: HTMLInputElement,fileCount: number,formData: FormData,NoteID: string,photoID: string){
  //           //check if the filecount is greater than zero, to be sure a file was selected.
  //           if (fileCount > 0) { // a file was selected
  //             //append the key name 'photo' with the first file in the element
  //             this.isUploadStarted = true;
  //                 formData.append('photo'+photoID, inputEl.files.item(0));
                  
  //               var headers = new Headers();
  //               headers.append('parentid', this.params.toString());
  //               headers.append('ownerid', this.currentAgentName); 
  //               headers.append('noteid', NoteID);   
  //             //call the angular http method 
  //              //post the form data to the url defined above and map the response. Then subscribe //to initiate the post. if you don't subscribe, angular wont post.
  //             this.http.post("/auth/fileuploading", formData, {headers: headers}).map((res:Response) => res.json()).subscribe(
  //                 //map the success function and alert the response
  //                  (success: any) => {
  //                          console.log(success);
                           
  //                          this.flashmessage.show("File Uploaded!!", {cssClass: 'alert-success', timeout: 2000});
  //                          this.isUploadStarted = false;
  //                          this.isFileAdded=false
  //                          this.temp = undefined;
  //                 },
  //                 (error: any) => {console.log(error); this.isUploadStarted = false;this.isFileAdded=false;alert('Upload Failed') });
  //           }
  //           else{
              
  //             alert('No files attached');
  //           }
  // }
  // onFileAttached(event: { target: { files: Blob[]; }; },noteID: any){
  //   this.isFileAdded=true;
  //   this.activeNoteTemp=noteID;
  //   console.log('file attached from notes');
  //   if (event.target.files && event.target.files[0]) {
  //     var reader = new FileReader();
  
  //     reader.onload = (a:any) => {
  //      this.previewURL = a.target.result;
  //      console.log(this.previewURL);
  //     }
  
  //     reader.readAsDataURL(event.target.files[0]);
      
  //   }
  // }
  // cancelUpload(){
  //   console.log('in cancel moudule');
  //   this.isFileAdded=false;
  //   this.previewURL=null;
  // }

}
