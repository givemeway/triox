import { Router } from '@angular/router';
import { AuthService } from './../../auth.service';
import { Component, OnInit } from '@angular/core';
import { NgForm} from "@angular/forms";
// import { FlashMessagesService } from 'angular2-flash-messages';
// import 'rxjs/RX';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }
  isSigning:any;
  ngOnInit() {
    this.isSigning = false;
    this.authService.authenticate = false;
    //if session is active re-direct to customer page
    if(localStorage.getItem('token')){
      this.router.navigate(['/auth/leads']);
    }
  }

  onLogin(signin: NgForm){
    this.isSigning = true;
     
      this.authService.getClientIP()
      .subscribe((body:any)=>{
 
         signin.value.IPDetails = body;
                 
         this.authService.onLogin(signin)
         .subscribe((body:any)=>{
          
             setTimeout(()=>{
               localStorage.setItem('token', body.Token);
               localStorage.setItem('Name', body.Name);
               localStorage.setItem('Email', body.Email);
               localStorage.setItem('UserID', body.UserID);
               this.authService.isLoggedIn = true;
               this.authService.LoggedInEmail = localStorage.getItem('Email');
               this.authService.LoggedInUserName = localStorage.getItem('Name');
               this.isSigning = false;
               if(localStorage.getItem('UserID')=="zcrm_1621357000000085003"){
               
                this.authService.authenticate = true;
               }
               if(localStorage.getItem('UserID')=="zcrm_1621357000000085004"){
               
                this.authService.authenticate = true;
               }
               
               this.router.navigate(['/auth/leads']);
             }, 10);
           
         },(error:any)=>{ 
               this.isSigning = false;
               
               if(error.status == 401){
               console.log(error);
               alert("Invalid Credentials in login module")
              //  this.flashmessage.show("Invalid Credentials", {cssClass: 'alert-danger', timeout: 3000});
               signin.reset();
               }
               else{
                 console.log(error);
                 alert("Something went wrong. Please try again")
                //  this.flashmessage.show("Something went wrong. Please try again", {cssClass: 'alert-danger', timeout: 3000});
                 signin.reset();
               }
         }); 
      },
        (error:any)=>{
          console.log(error);
          alert("something went wrong. try again");
      });

      
  }
}
