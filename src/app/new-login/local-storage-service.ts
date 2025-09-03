import { Injectable } from '@angular/core';
import { KeyValuePair } from './login-models';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  
  writeToLocalStorage(data: KeyValuePair)
  {
    localStorage.setItem(data.key, data.value);
  }

  getFromLocalStorage(key: string): string | null
  {
    const jwt = localStorage.getItem(key);
    console.log(jwt);
    return jwt;
  }

  deleteFromLocalStorage(key: string)
  {
    localStorage.removeItem(key);
  }

}
