import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LoginInformation } from './login-models';

@Injectable({
  providedIn: 'root'
})
export class NewLoginService {
  

  private serverUrl = "http://localhost:8080/api/v1";

  private http = inject(HttpClient);

  loginUser( loginInfo: LoginInformation)
  {
    return this.http.post(`${this.serverUrl}/login`, loginInfo);
  }
}
