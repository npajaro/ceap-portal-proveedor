import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Router } from '@angular/router';
import { Tercero } from '@interfaces/tercero.interface';
import { ApiService } from '@services/api.service';
import { ValidatorsService } from '@services/validators.service';



@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressBarModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit{


  private fb              = inject(FormBuilder);
  private router          = inject(Router);
  private validatorsSv    = inject(ValidatorsService);
  private apiSv           = inject(ApiService);

  public tercero!: Tercero;

  public loginForm: FormGroup = this.fb.group({
    numberNit: [ '', [Validators.required, Validators.minLength(6), Validators.maxLength(10)] ],
  })

  ngOnInit(): void {
    this.loginForm.reset();
  }



  public isValidField ( field: string) {
    return this.validatorsSv.isValidField( this.loginForm, field)
  }

  public getFieldError( field: string ) {
    return this.validatorsSv.getFieldError(this.loginForm, field)
  }

  public login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const nit = this.loginForm.get('nit')?.value || '';
    console.log(nit);

    this.router.navigateByUrl('/auth/otp-validators');
  }


 }
