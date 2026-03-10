import { Type } from '@angular/core';

export interface ModalData {
  title: string;
  message?: string;
  content?: Type<any>;
  visible: boolean;
}