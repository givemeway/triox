import { LeadsComponent } from './../auth/leads/leads.component';
import { NgForm } from '@angular/forms';
import { SearchComponent } from './../auth/search/search.component';
import { AuthService } from './../auth.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  providers:[SearchComponent,LeadsComponent]
})
export class NavbarComponent implements OnInit {
  
  constructor(private router: Router,  public authService: AuthService, public search: SearchComponent, public lead: LeadsComponent) { }

  ngOnInit() {
    this.authService.isLoggedIn=false;
     
     
     if(localStorage.getItem('token')){
       
      this.authService.isLoggedIn=true;
      this.authService.LoggedInUserName = localStorage.getItem('Name');
      this.authService.LoggedInEmail = localStorage.getItem('Email');
      if(localStorage.getItem('UserID')=="zcrm_1621357000000085003" ){
        this.authService.authenticate = true;
       }
       else if (localStorage.getItem('UserID')=="zcrm_1621357000000085004"){
        this.authService.authenticate = true;
       }
       else{
        this.authService.authenticate = false;
       }
     }
     else{
      this.authService.isLoggedIn=false;
      this.authService.LoggedInUserName = null;
      this.authService.LoggedInEmail = null;
     }
  }
  onLogout(){
    localStorage.clear();
    this.authService.isLoggedIn = false;
    this.router.navigate(['/auth/login']);
  }

  Search(f: NgForm){
    this.search.onSearch(f.value.name);
    this.router.navigate(['/auth/search'], {queryParams: {QuerySearch: f.value.name}});
  }


}
