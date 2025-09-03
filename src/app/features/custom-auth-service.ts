import { inject, Injectable } from '@angular/core';
import { LocalStorageService } from 'app/new-login/local-storage-service';

@Injectable({
  providedIn: 'root'
})
export class CustomAuthService {
  private storageService = inject(LocalStorageService);

  check() //if jwt exists, user is logged in
  {
    return this.storageService.getFromLocalStorage('jwt') !== null;
  } 
}
