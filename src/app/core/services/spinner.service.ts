import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
// Cambio en la estructura: la clave será una combinación de id y type
private loadingStates = new BehaviorSubject<{[key: string]: boolean}>({});

// Método para generar una clave única a partir de id y type
private generateKey(id: string, type: string): string {
  return `${id}_${type}`;
}

show(id: string, type: string): void {
  const key = this.generateKey(id, type);
  const currentStates = this.loadingStates.value;
  this.loadingStates.next({...currentStates, [key]: true});
}

hide(id: string, type: string): void {
  const key = this.generateKey(id, type);
  const currentStates = this.loadingStates.value;
  this.loadingStates.next({...currentStates, [key]: false});
}

isLoading(id: string, type: string) {
  const key = this.generateKey(id, type);
  return this.loadingStates.asObservable()
    .pipe(
      map(states => !!states[key])
    );
}


}
