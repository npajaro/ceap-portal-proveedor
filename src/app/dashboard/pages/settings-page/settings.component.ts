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
  public originalDataProveedor!: { F015_EMAIL: string; F015_CONTACTO: string; F015_CELULAR: string; F015_DIRECCION1: string; };

  public myForm: FormGroup = this.fb.group({
    F015_EMAIL:       ['', Validators.required],
    F015_CONTACTO:    ['', Validators.required],
    F015_CELULAR:     ['', Validators.required],
    F015_DIRECCION1:  ['', Validators.required],
  });

  constructor() {

    effect(() => {
      const onlyDataProveedor = this.dataProveedor$() || {} as Proveedor;
      this.myForm.patchValue(this.dataProveedor$() || {} as Proveedor);

      const dataProveedor = {
        F015_EMAIL:       onlyDataProveedor.F015_EMAIL,
        F015_CONTACTO:    onlyDataProveedor.F015_CONTACTO,
        F015_CELULAR:     onlyDataProveedor.F015_CELULAR,
        F015_DIRECCION1:  onlyDataProveedor.F015_DIRECCION1,
      }

      this.originalDataProveedor = dataProveedor;
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

    // Obtener data del formulario y agregarle los demás campos que tengo en la signal dataProveedor$() || {} as Proveedor

    const myFormValue = this.myForm.value;
    const dataProveedor = this.dataProveedor$() || {} as Proveedor;

    const dataProveedorToSend = {
      ...dataProveedor,
      ...myFormValue
    }

    console.log('dataProveedorToSend', dataProveedorToSend);

    // Enviar formulario
    this.apiSv.updateProveedor(dataProveedorToSend).subscribe({
      next: () => {
        this.coreSnackBarSv.openSnackbar('Proveedor actualizado correctamente', 'Cerrar', ToastId.SUCCESS);
        this.apiSv.getProveedor().subscribe();
      },
      error: () => {
        console.error('Error al actualizar el proveedor', Error);
        this.coreSnackBarSv.openSnackbar('Ha ocurrido un error al actualizar el proveedor', 'Cerrar', ToastId.ERROR);
      }
    })
  }



  public hasFormChanges(): boolean {
    const currentData = this.myForm.value;
    return JSON.stringify(currentData) === JSON.stringify(this.originalDataProveedor);
  }



}
