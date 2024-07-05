import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Router } from '@angular/router';
import { ValidatorsService } from '@services/validators.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatProgressBarModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  private fb            = inject(FormBuilder);
  private router        = inject(Router);
  private validatorsSv   = inject(ValidatorsService);

  public hide: boolean = true;

  public loginForm = this.fb.group({
    nit:            ['', [Validators.required, Validators.minLength(6)]],
  });

  clickEvent(event: MouseEvent) {
    this.hide = !this.hide;
    event.stopPropagation();
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
    this.router.navigateByUrl('/dashboard');
  }



 }
