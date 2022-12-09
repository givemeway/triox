import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
// import { FlashMessagesService } from 'angular2-flash-messages';
import * as moment from 'moment';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css']
})
export class ActivityComponent implements OnInit {

  constructor(public authservice: AuthService, private router: Router) { }

 temploginactivity = [];
  ngOnInit() {
    this.getAgentDetails();
  }
 getAgentDetails(){
    this.authservice.getAgentsActivity().subscribe((data:any)=>{
        for(let i=0; i<data.length; i++){
          for(let j=0; j<data[i].LoginActivity.length; j++){

            if(data[i]['LoginActivity'].length >0){
            data[i]['LoginActivity'][j]["GeoAddress"]["LoginTime"] = moment(data[i]['LoginActivity'][j]["GeoAddress"]["LoginTime"]).format('MMMM Do YYYY, h:mm:ss a');
            }
            
          }
         
        }
         this.temploginactivity = data;
         console.log(data)

    },error=>{
        console.log(error);
        if(error.json()==="Denied"){
          this.router.navigate(['/auth/leads']);
          alert("Access Denied");
        }
        else if(error.json().name ==="JsonWebTokenError"){
          localStorage.clear();
          this.authservice.isLoggedIn = false;
          alert("Session Expired. Login to continue")
          // this.flashmessage.show("Session Expired. Login to continue", {cssClass: 'alert-danger', timeout: 3000});
          this.router.navigate(['/auth/login']);
        }
        
    });
 }
}
