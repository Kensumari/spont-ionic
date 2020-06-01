import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { UserState } from './store/auth.reducer';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: "root",
})
export class AuthService {
  constructor(private readonly httpClient: HttpClient) {
  }

  signUp(newUserInfo: UserState): Observable<object> {
    return this.httpClient.post('placeholder for firebase url', newUserInfo);
  }
}



