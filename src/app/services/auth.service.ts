import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { baseURL } from '../shared/baseUrl';
import { ProcessHttpErrorMsgService } from './process-http-error-msg.service';

interface AuthResponse {
  status: string;
  success: string;
  token: string;
}

interface SignUpResponse {
  success: string;
  status: string;
}

interface JWTResponse {
  status: string;
  success: string;
  user: any;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  tokenKey = 'JWT';
  isAuthenticated: Boolean = false;
  username: Subject<string> = new Subject<string>();
  authToken: string = undefined;
  admin: Subject<boolean> = new Subject<boolean>();
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(
    private http: HttpClient,
    private processHTTPMsgService: ProcessHttpErrorMsgService
  ) {
    this.currentUserSubject = new BehaviorSubject<any>(
      JSON.parse(localStorage.getItem('JWT'))
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  checkJWTtoken() {
    this.http.get<JWTResponse>(baseURL + 'users/checkJWTtoken').subscribe(
      (res) => {
        console.log('JWT Token Valid: ', res);
        this.sendUsername(res.user.username);
      },
      (err) => {
        console.log('JWT Token invalid: ', err);
        this.destroyUserCredentials();
      }
    );
  }

  sendUsername(name: string) {
    this.username.next(name);
  }

  clearUsername() {
    this.username.next(undefined);
  }

  loadUserCredentials() {
    console.log(this.tokenKey);
    const credentials = JSON.parse(localStorage.getItem(this.tokenKey));
    console.log('loadUserCredentials ', credentials);
    if (credentials && credentials.username !== undefined) {
      this.useCredentials(credentials);
      if (this.authToken) {
        console.log(this.authToken);
        this.checkJWTtoken();
      }
    }
  }

  storeUserCredentials(credentials: any) {
    console.log('storeUserCredentials ', credentials);
    localStorage.setItem(this.tokenKey, JSON.stringify(credentials));
    console.log(this.tokenKey, JSON.stringify(credentials));
    this.useCredentials(credentials);
  }

  useCredentials(credentials: any) {
    this.isAuthenticated = true;
    this.sendUsername(credentials.username);
    this.authToken = credentials.token;
  }

  destroyUserCredentials() {
    this.authToken = undefined;
    this.clearUsername();
    this.isAuthenticated = false;
    localStorage.removeItem(this.tokenKey);
  }

  signUp(signup: any): Observable<any> {
    return this.http
      .post<SignUpResponse>(baseURL + 'users/signup', {
        username: signup.username,
        password: signup.password,
        fullname: signup.fullname,
      })
      .pipe(
        map((res) => {
          return { success: true, username: signup.username };
        }),
        catchError((error) => this.processHTTPMsgService.handleError(error))
      );
  }

  logIn(user: any): Observable<any> {
    return this.http
      .post<AuthResponse>(baseURL + 'users/login', {
        username: user.username,
        password: user.password,
      })
      .pipe(
        map((res) => {
          this.storeUserCredentials({
            username: user.username,
            token: res.token,
          });
          return { success: true, username: user.username };
        }),
        catchError((error) => this.processHTTPMsgService.handleError(error))
      );
  }

  logOut() {
    this.destroyUserCredentials();
  }

  isLoggedIn(): Boolean {
    return this.isAuthenticated;
  }

  getUsername(): Observable<string> {
    return this.username.asObservable();
  }

  getToken(): string {
    if (this.authToken) {
      return this.authToken;
    } else if (localStorage.getItem('JWT')) {
      this.authToken = JSON.parse(localStorage.getItem('JWT')).token;
      return this.authToken;
    }
    return this.authToken;
  }
  public get currentUserValue() {
    return this.currentUserSubject.value;
  }
}
