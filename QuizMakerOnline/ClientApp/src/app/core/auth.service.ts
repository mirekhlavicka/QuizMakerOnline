import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  @Output() authStatusChanged: EventEmitter<any> = new EventEmitter();

  private authUrl = 'api/auth';  // URL to web api

  public redirectUrl: string;
  
  constructor(private httpClient: HttpClient) { }

  public login(userName: string, password: string, rememberMe: boolean)/*: Observable<Result>*/ {
    const url: string = `${this.authUrl}/login`;
    var data = {
      userName: userName,
      password: password,
      rememberMe: rememberMe
    };
    return this.httpClient.post/*<HttpBaseResult>*/(url, data, { responseType: 'text', withCredentials: true }).pipe(tap(_ => this.authStatusChanged.emit("login")));
  }

  public logout() {
    const url: string = `${this.authUrl}/logout`;
    return this.httpClient.post(url, null, { responseType: 'text', withCredentials: true }).pipe(tap(_ => this.authStatusChanged.emit("logout")));;
  }

  public isAuthenticated(): Observable<boolean> {
    const url: string = `${this.authUrl}/IsAuthenticated`;
    return this.httpClient.get<boolean>(url);
  }

  public fullName(): Observable<string> {
    const url: string = `${this.authUrl}/FullName`;
    return this.httpClient.get/*<string>*/(url, { responseType: 'text', withCredentials: true });
  }
}
