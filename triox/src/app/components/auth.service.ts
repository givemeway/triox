import { HttpClient , HttpHeaders , HttpResponse,HttpErrorResponse  } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Injectable } from '@angular/core';
import {Observable,throwError,of} from 'rxjs';
import { catchError, retry,map,tap } from 'rxjs/operators';
// import 'rxjs/RX';

@Injectable()
export class AuthService {
  isDev = true;
  isLoggedIn:any;
  rows_columns_list: any;
  LoggedInUserName:any;
  LoggedInEmail:any;
  ReportDetails:any;
  authenticate=false;
  constructor(private http: HttpClient ) { }
  
  onLogin(form: NgForm){
    // const body = JSON.stringify(form.value);
    const body = form.value;
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    const token = localStorage.getItem('token')||[];

    // headers.append('Content-Type', 'application/json');

    const URL = this.hostURL(this.isDev, "/auth/login" );

    return this.http.post(URL, body, {headers: headers}).pipe( 
      map((data:any)=>{

        catchError(error=>{
          return error
        })
        return data;
      })
      
      );
    

  }
  getClientIP (){
    return this.http.get("https://ipapi.co/json").pipe(map((data:any)=>{

      catchError(error=>{
        return error
      })
      
      return data;
    }));
}
  getAgentsActivity(){

    const token = localStorage.getItem('token')||[];
    const headers = new HttpHeaders({'Content-Type': 'application/json','Authorization': token});
    // headers.append('Content-Type', 'application/json');
    // headers.append('Authorization', token);
    const URL = this.hostURL(this.isDev, "/auth/activity" );

    return this.http.get(URL, {headers: headers}).pipe(map((data:any)=>{

      catchError(error=>{
        return error
      })
     
      return data;
    }));

  }

  onSearchSubmit(name:any){
    const token = localStorage.getItem('token')||[];
    const headers = new HttpHeaders({'Content-Type': 'application/json','Authorization': token});
    // headers.append('Content-Type', 'application/json');
    // headers.append('Authorization', token);
    const URL = this.hostURL(this.isDev, "/auth/search" );

    return this.http.post(URL, {name}, {headers: headers}).pipe(map((data:any)=>{

      catchError(error=>{
        return error
      })
    
      return data;
    }));
     

  }

  getUserById(params:any,clientdetails:any){
    const token = localStorage.getItem('token')||[];
    const headers = new HttpHeaders({'Content-Type': 'application/json','Authorization': token});
    // headers.append('Content-Type', 'application/json');
    // headers.append('Authorization', token);
    const URL = this.hostURL(this.isDev, "/auth/results" );
    return this.http.post(URL, {data: params,IPDetails:clientdetails}, {headers: headers}).pipe(map((data:any)=>{

      catchError(error=>{
        return error
      })
     
      return data;
    }));
     
  }

  updateUser(objId:any, data:any, property:any,currentAgentName:any,IPDetails:any ){
    const token = localStorage.getItem('token')||[];
    const headers = new HttpHeaders({'Content-Type': 'application/json','Authorization': token});
    // headers.append('Content-Type', 'application/json');
    // headers.append('Authorization', token);
    const URL = this.hostURL(this.isDev, "/auth/update" );
    return this.http.put(URL, {objId, data, property,currentAgentName,IPDetails}, {headers: headers}).pipe(map((data:any)=>{

      catchError(error=>{
        return error
      })
      
      return data;
    }));
  }

  getUserNotes(ParentID:any, isGetAllNotes:any){

    const token = localStorage.getItem('token')||[];
    const headers = new HttpHeaders({'Content-Type': 'application/json','Authorization': token});
    // headers.append('Content-Type', 'application/json');
    // headers.append('Authorization', token);
    const URL = this.hostURL(this.isDev, "/auth/notes" );
    return this.http.post(URL, {data: ParentID, getAllNotes: isGetAllNotes}, {headers: headers}).pipe(map((data:any)=>{

      catchError(error=>{
        return error
      })
     
      return data;
    }));
     
  }

  submitNewCustomer(UserInfo:any){
    const token = localStorage.getItem('token')||[];
    const headers = new HttpHeaders({'Content-Type': 'application/json','Authorization': token});
    
    // headers.append('Content-Type', 'application/json');
    // headers.append('Authorization', token);
    const URL = this.hostURL(this.isDev, "/auth/createuser" );
    return this.http.post(URL, UserInfo, {headers: headers}).pipe(map((data:any)=>{

      catchError(error=>{
        return error
      })
      
      return data;
    }));
  }

  getLeads(page:any, index:any,sortorder:any,sortelement:any){
    const token = localStorage.getItem('token')||[];
    const headers = new HttpHeaders({'Content-Type': 'application/json','Authorization': token});
    // const httpOptions = { headers: headers}
    // headers.append('Content-Type', 'application/json');
    // headers.append('Authorization', token);
    const body = { page: page, index: index,sort: sortorder,sortelement: sortelement};

    const URL = this.hostURL(this.isDev, "/auth/index" );    
    return this.http.post(URL, body , {headers: headers}).pipe(map((data:any)=>{

      catchError(error=>{
        return error
      })
      return data;
    }));
  }
  addNotes(ParentID:any, noteContent:any, currentAgentName:any){
    
    const body = { ParentID : ParentID, NoteObject: noteContent, CurrentAgentName: currentAgentName};
    const token = localStorage.getItem('token')||[];
    const headers = new HttpHeaders({'Content-Type': 'application/json','Authorization': token});
    const URL = this.hostURL(this.isDev, "/auth/newNotes" );      
    return this.http.post(URL, body , {headers: headers}).pipe(map((data:any)=>{

      catchError(error=>{
        return error
      })
      return data;
    }));
  }

  getDevices(ids:any){
    
    const token = localStorage.getItem('token')||[];
    // const headers = new HttpHeaders({'Content-Type': 'application/octet-stream',
    // 'Content-Disposition': 'attachment; filename="download.xlsx"',
    // 'Authorization': token,'responseType':'blob'});
    const headers = new HttpHeaders({'Authorization': token});
    const URL = this.hostURL(this.isDev, "/auth/fetchDevices" );   

    return this.http.post(URL, {ids} , {headers: headers,responseType: "blob"}).pipe(map((data:any)=>{
      catchError(error=>{
        console.log(error)
        return error
      })

      return data;
    }));

  }
  
  editNotes(noteID:any,noteContent:any){

    const body = { NoteID : noteID, NoteContent: noteContent["Note Content"], NoteStatus: noteContent["Note Status"], 
                    Steps: noteContent["TroubleShooting Steps"], IssueType: noteContent["Issue Type"], 
                    issueDescription: noteContent["Issue Description"],
                    ParentID: noteContent.ParentID};
    const headers = new HttpHeaders();
    const token = localStorage.getItem('token')||[];
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', token);
    const URL = this.hostURL(this.isDev, "/auth/editNotes" );      
    return this.http.put(URL, body , {headers: headers}).pipe(map((data:any)=>{

      catchError(error=>{
        return error
      })
  
      return data;
    }));
  }

  hostURL(isDev:any, route:any){
      if(isDev){
        return 'http://localhost:3000'+route;
      }
      else{
        return route;
      }
  }
  deletelead(LeadID:any){
    const Body = { LeadID : LeadID};    
    const token = localStorage.getItem('token')||[];
    const headers = new HttpHeaders({'Content-Type': 'application/json','Authorization': token});

    const options = {
      headers: headers,
      body: Body
    };
    const URL = this.hostURL(this.isDev, "/auth/delete" );  
    
    return this.http.delete(URL, options).pipe(map((data:any)=>{

      catchError(error=>{
        return error
      })
      
      return data;
    }));

  }

  getBar(code:any,bar_options:any,truncate:any):Observable<any>{
    var token = localStorage.getItem('token')||[];
    const headers = new HttpHeaders({'Content-Type': 'application/json','Authorization': token});
   
    // headers.append('Content-Type', 'application/json');
    // headers.append('Authorization', token);
    const URL = this.hostURL(this.isDev, "/auth/reports" );

    return this.http.post(URL, {code,bar_options,truncate}, {headers: headers}).pipe(tap((data:any)=>{
      catchError((err:any)=>throwError(err));
      
      return data;
    }));

  }

  errorHandler(error: HttpErrorResponse){
    console.log('error triggered')
    let errorMessage ="Unknown Error!"
    if ( error.error instanceof ErrorEvent){
      errorMessage = `Error: ${error.error.message}`;
      
    }
    else{
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    alert(errorMessage)
    return throwError(errorMessage);
  }

  generateReport(QueryBuilder:any){
    console.log(QueryBuilder);

    const headers = new HttpHeaders();
    const token = localStorage.getItem('token')||[];
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', token);
    const URL = this.hostURL(this.isDev, "/auth/reports" );

    return this.http.post(URL, QueryBuilder, {headers: headers}).pipe(map((data:any)=>{

      catchError(error=>{
        return error
      })
     
      return data;
    }));
  }

}
