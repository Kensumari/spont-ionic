import { Component, OnInit } from "@angular/core";
import { format } from 'date-fns';

@Component({
  selector: "app-auth",
  templateUrl: "./auth.page.html",
  styleUrls: ["./auth.page.scss"],
})
export class AuthPage implements OnInit {
  phoneNumber?: number;
  dateOfBirth?: string; //TODO change data format to backend format
  gender?: string; //TODO change to radio buttons
  userName?: string;

  logUserName(){
    console.log(this.userName);
  }

  constructor() {}

  ngOnInit() {}

  submitForm() {
    console.log(`${this.phoneNumber} ${this.gender} ${this.userName}`);
  }

  getCurrentDateInInternationalFormat() {
    return format(new Date(), 'yyyy-MM-dd');
  }

  submit() {
    let a = format(new Date(this.dateOfBirth!), 'yyyy-MM-dd')
    console.log(a);
  }
}
