import { Injectable, Type } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ModalData {
  title: string;
  content?: string | Type<any>;
  inputs?: { [key: string]: any };
  visible: boolean;
}

@Injectable({ providedIn: 'root' })
export class ModalService {
  private modalState = new BehaviorSubject<ModalData>({
    title: '',
    visible: false,
  });

  modalState$ = this.modalState.asObservable();

  open(title: string, content: string | Type<any>, inputs?: { [key: string]: any }) {
    this.modalState.next({ title, content, inputs, visible: true });
  }

  close() {
    this.modalState.next({ ...this.modalState.value, visible: false });
  }
}