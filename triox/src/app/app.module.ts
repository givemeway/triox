import { ShowcustomerComponent } from './components/auth/search/showcustomer/showcustomer.component';
import { AuthService } from './components/auth.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule,ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { AuthComponent } from './components/auth/auth.component';
import { LoginComponent } from './components/auth/login/login.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SearchComponent } from './components/auth/search/search.component';
import { NewCustomerComponent } from './components/auth/new-customer/new-customer.component';
import { DatepickerModule  } from 'ng2-datepicker';
import { LeadsComponent } from './components/auth/leads/leads.component';
// import { FlashMessagesModule} from 'angular2-flash-messages';
import { ReadMoreComponent } from './components/read-more/read-more.component';
import { InlineeditComponent } from './components/inlineedit/inlineedit.component';
import { ReportsComponent } from './components/auth/reports/reports.component';
import { DetailsComponent } from './components/auth/reports/details/details.component';
import { ActivityComponent } from './components/auth/activity/activity.component';
import { NgxSliderModule } from '@angular-slider/ngx-slider';

const AppRoutes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  { path: 'auth', component: AuthComponent,
      children : [
        {path: '', redirectTo: 'leads', pathMatch: 'full'},
        {path: 'login', component: LoginComponent },
        {path: 'search', component: SearchComponent
            // children:[  
            //   {path: '', redirectTo: 'show', pathMatch: 'full'},
            //   {path: 'show/:customer', component: ShowcustomerComponent }
            // ]
        },
        { path: 'show/:customer', component: ShowcustomerComponent},
        { path: 'newCustomer', component: NewCustomerComponent }, 
        { path: 'leads', component: LeadsComponent},
        { path: 'reports', component: ReportsComponent},
        { path: 'reports/details', component: DetailsComponent},
        { path: 'activity', component: ActivityComponent}
      ]
  },
  { path: 'navbar', component: NavbarComponent}    
]

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    LoginComponent,
    NavbarComponent,
    SearchComponent,
    ShowcustomerComponent,
    NewCustomerComponent,
    LeadsComponent,
    ReadMoreComponent,
    InlineeditComponent,
    ReportsComponent,
    DetailsComponent,
    ActivityComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(AppRoutes),
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    NgxSliderModule,
    DatepickerModule,
    // FlashMessagesModule
  ],
  providers: [AuthService,ReportsComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
