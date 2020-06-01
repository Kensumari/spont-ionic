import { Component, OnInit } from "@angular/core";
import { format } from "date-fns";
import {
  signUpRequest,
  signUpFailure,
  signUpSuccess,
} from "../store/auth.actions";
import { Store } from "@ngrx/store";
import { Actions, ofType } from "@ngrx/effects";

@Component({
  selector: "app-auth",
  templateUrl: "./auth.page.html",
  styleUrls: ["./auth.page.scss"],
})
export class AuthPage implements OnInit {
  phoneNumber?: number;
  dateOfBirth?: string; // TODO change data format to backend format
  gender?: string; // TODO change to radio buttons
  userName?: string;

  logUserName() {
    console.log(this.userName);
  }

  constructor(private readonly store: Store, private readonly actions: Actions) {}

  ngOnInit() {
    this.store.dispatch(
      signUpRequest({
        user: {
          phoneNumber: 1,
          dateOfBirth: "asd",
          userName: "asd",
          gender: "asd",
        },
      })
    );
    this.actions.pipe(ofType(signUpSuccess)).subscribe(() => {
      // todo decide what happens with the user flow when sign up is successful
      console.log("success");
    });
    this.actions.pipe(ofType(signUpFailure)).subscribe(({ error }) => {
      // todo decide what happens with the user flow when sign up fails
      console.log(error);
    });
  }

  signUp() {
    if (
      this.phoneNumber === undefined ||
      this.dateOfBirth === undefined ||
      this.userName === undefined ||
      this.gender === undefined
    ) {
      // this should never be reached unless there is a bug with the form,
      // but the if check helps by smart casting
      throw new Error();
    }
    this.store.dispatch(
      signUpRequest({
        user: {
          phoneNumber: this.phoneNumber,
          dateOfBirth: this.dateOfBirth,
          userName: this.userName,
          gender: this.gender,
        },
      })
    );
  }

  getCurrentDateInInternationalFormat() {
    return format(new Date(), "yyyy-MM-dd");
  }

  submit() {
    const a = format(new Date(this.dateOfBirth!), "yyyy-MM-dd");
    console.log(a);
  }
}
