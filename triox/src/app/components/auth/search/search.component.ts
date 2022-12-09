import { NgForm } from '@angular/forms';
// import { FlashMessagesService } from 'angular2-flash-messages';
import { Router, ActivatedRoute,Params } from '@angular/router';
import { AuthService } from './../../auth.service';
import { Component, OnInit,Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable()
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  name: undefined;
  email: undefined;
  isSearch =false;
  results:any;
  params: any;

  constructor(private authService: AuthService, private router: Router, public route: ActivatedRoute) { }

  ngOnInit() {
    this.name = undefined;
    this.email = undefined;
    this.route.queryParams.subscribe((params: Params)=>{
      
      this.params = params["QuerySearch"];
    });
  console.log(this.params)
  this.onSearch(this.params);
  }
  onSearch(f:any){
      var searchquery;    
      if(typeof(f) ==="object"){
        searchquery = f.value.name.split(" ");
        this.router.navigate(['/auth/search'], {queryParams: {QuerySearch: f.value.name}}); 
      }
      else if (typeof(f) ==="string"){
        searchquery = f.split(" ");
        this.router.navigate(['/auth/search'], {queryParams: {QuerySearch: f}});
      }

      this.isSearch = false;
      this.results =[];
      var query ='';

      for(let i=0;i<searchquery.length;i++){
          query = query+"\""+searchquery[i]+"\"";
      }

      this.authService.onSearchSubmit(query).subscribe((result:any)=>{
          if(result){
            for( let i =0; i<result.searchResults.length; i++){
              result.searchResults[i]["Created Time"]= moment(result.searchResults[i]["Created Time"]).format('MMMM Do YYYY, h:mm:ss a');
              this.results.push(result.searchResults[i]);
            }
            this.isSearch = true;
            
          }
        }, (error)=>{ 
          
          console.log(error);
          localStorage.clear();
          this.router.navigate(['/auth/login']);
          this.authService.isLoggedIn = false;
          alert("Session Expired. Login to continue")
          // this.flashmessage.show("Session Expired. Login to continue", {cssClass: 'alert-danger', timeout: 3000});
      });
  }

  onClear(){
    this.isSearch = false;
    this.results = [];
    return;
  }

}
