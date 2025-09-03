import { Component, inject } from '@angular/core';
import { MtxDialog } from '@ng-matero/extensions/dialog';
import { NewLoginService } from './new-login-service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { JWTReceived, LoginInformation } from './login-models';
import { LocalStorageService } from './local-storage-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-login',
  standalone: true,
  imports: [
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './new-login.html',
  styleUrl: './new-login.css'
})
export class NewLogin {

  private mtxDialog = inject(MtxDialog);
  private loginService = inject(NewLoginService);
  private formBuilder = inject(FormBuilder);
  private storageService = inject(LocalStorageService);
  private router = inject(Router);

  loginForm: FormGroup = this.formBuilder.group({
    username: '',
    password: ''
  });

  handleLoginAction()
  {
    console.log(`logging in ...`);
    const loginInfo: LoginInformation = {
      username: this.loginForm.value['username'] || '',
      password: this.loginForm.value['password'] || ''
    };

    console.log(`log in data:`);
    console.log(loginInfo);

    if(loginInfo.username === '')
    {
      console.log('username is required');
      return;
    }

    if( loginInfo.password === '')
    {
      console.log('password is required');
      return;
    }

    this.loginService.loginUser(loginInfo)
    .subscribe({
      next: (result) => {
        const token: JWTReceived = { 
          status: (result as JWTReceived).status,
          token: (result as JWTReceived).token
        };

        if( token.status === 'success' )
        {
          this.storageService.writeToLocalStorage({
            key: 'jwt',
            value: token.token
          });
          
          console.log(`Succesfully logged in. Token stored in localStorage\ntoken: ${this.storageService.getFromLocalStorage('jwt')}`);
          
          this.router.navigateByUrl('/dashboard');
        }
        else
        {
          console.log('Failed to login!\nCheck your credentials and retry.');
        }
        
      },
      error: (response) => {
        console.log(`Failed to log in:`);
        console.log(response.error.text);
      }
    }
  );
  }

}
