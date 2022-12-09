import { Router } from '@angular/router';
import { ShowcustomerComponent } from './../auth/search/showcustomer/showcustomer.component';
import { NgForm } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'inlineedit',
  templateUrl: './inlineedit.component.html',
  styleUrls: ['./inlineedit.component.css'],
  providers:[ShowcustomerComponent]
})
export class InlineeditComponent implements OnInit {

  isClicked: boolean | undefined;
  @Input() field: any;
  @Input() property: any;
  @Input() ParentID: any;
  @Output() UpdatedCustomer: EventEmitter<any> = new EventEmitter<any>();
  PlanDuration = ["12 Months", "OTF", "6 Months","18 Months","24 Months"];
  isRating: boolean | undefined;

  constructor(public show: ShowcustomerComponent, private router: Router) { }

  ngOnInit() {
    this.isClicked = false;
    this.isRating = false;

  }
  isEdited(){
   
    this.isClicked = true;
  }
  editDone(data: NgForm){
    data.value.ParentID = this.ParentID;

    this.isClicked = false;
    
    this.UpdatedCustomer.emit(data);
    
  }

  cancelEdit(){
    this.isClicked = false;
    
  }
  stopPropagation(event: Event){
    event.stopPropagation();
  } 
}
