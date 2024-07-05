import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthLayoutComponent } from './layout/auth-layout.component';
import { OtpPageComponent } from './otp-page/otp-page.component';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      // {path: '**', redirectTo: 'login'},
      {path: 'login', component: LoginComponent, data: { title: 'Login', icon: 'login' }},
      {path: 'otp-validators', component: OtpPageComponent, data: { title: 'OTP-Validators', icon: 'pin'}},
      {path: 'register', component: RegisterComponent, data: { title: 'Register', icon: 'how_to_reg' }},
    ]
  }
]
