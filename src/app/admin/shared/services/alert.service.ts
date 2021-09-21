import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

export type AlertType = 'success' | 'info' | 'danger';

export interface Alert {
  text: string;
  type: AlertType;
}

@Injectable()
export class AlertService {
  alert$: Subject<Alert> = new Subject();

  success(text: string) {
    this.alert$.next({ text, type: 'success' });
  }

  info(text: string) {
    this.alert$.next({ text, type: 'info' });
  }

  danger(text: string) {
    this.alert$.next({ text, type: 'danger' });
  }
}
