import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { Proveedor } from '@interfaces/tercero.interface';
import { ApiService } from '@services/api.service';
import { CoreDialogService } from '@services/core-dialog.service';
import { CoreSnackbarService } from '@services/core-snackbar.service';
import { ToastId } from '../../../core/interfaces/toast-Id.enum';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SettingsComponent {
  private apiSv           = inject(ApiService);
  private coreDialogSv    = inject(CoreDialogService);
  private coreSnackBarSv  = inject(CoreSnackbarService);
  private fb              = inject(FormBuilder);

  public ToastId!: ToastId;
  public dataProveedor$ = computed(() => this.apiSv.dataProveedor$());
  public originalDataProveedor!: Proveedor;

  public myForm: FormGroup = this.fb.group({
    email:      ['', Validators.required],
    contacto:   ['', Validators.required],
    telefono:   ['', Validators.required],
    dirrecion:  ['', Validators.required],
  });

  constructor() {
    effect(() => {
      this.myForm.patchValue(this.dataProveedor$() || {});
      this.originalDataProveedor = this.dataProveedor$() || {} as Proveedor;
    });

  }

  public onSubmit() {
    // Vetrificar si hay cambios
    if (this.hasFormChanges()) {
      this.coreSnackBarSv.openSnackbar('No se han realizado cambios', 'Cerrar', ToastId.WARNING);
      return;
    }

    // Validar formulario
    if (this.myForm.invalid) {
      this.coreSnackBarSv.openSnackbar('Por favor, complete los campos requeridos', 'Cerrar', ToastId.ERROR);
      return;
    }

    const dataProveedor = this.myForm.value;

    // Enviar formulario
    // this.apiSv.updateProveedor(dataProveedor).subscribe({
    //   next: () => {
    //     this.coreSnackBarSv.openSnackbar('Proveedor actualizado correctamente', 'Cerrar', ToastId.SUCCESS);
    //     this.apiSv.getProveedor().subscribe();
    //   },
    //   error: () => {
    //     this.coreSnackBarSv.openSnackbar('Ha ocurrido un error al actualizar el proveedor', 'Cerrar', ToastId.ERROR);
    //   }
    // })
  }



  public hasFormChanges(): boolean {
    const currentData = this.myForm.value;
    return JSON.stringify(currentData) === JSON.stringify(this.originalDataProveedor);
  }



}
