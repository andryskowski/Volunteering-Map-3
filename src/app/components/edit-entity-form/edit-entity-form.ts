import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalService } from '../../services/modal-service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

export interface FieldConfig {
  name: string;
  label: string;
  type?: 'text' | 'textarea' | 'select';
  options?: string[];
  validators?: any[];
}

@Component({
  selector: 'app-edit-entity-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form *ngIf="form" [formGroup]="form" (ngSubmit)="submit()" class="edit-form">
      <ng-container *ngFor="let field of fields">
        <label>{{ field.label }}</label>

        <input *ngIf="!field.type || field.type === 'text'" [formControlName]="field.name" />

        <textarea *ngIf="field.type === 'textarea'" [formControlName]="field.name"></textarea>

        <select *ngIf="field.type === 'select'" [formControlName]="field.name">
          <option *ngFor="let opt of field.options" [value]="opt">{{ opt }}</option>
        </select>
      </ng-container>

      <button type="submit" [disabled]="form.invalid">Save</button>
    </form>
  `,
  styles: [
    `
      .edit-form {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
      .edit-form label {
        font-weight: bold;
      }
      .edit-form input,
      .edit-form select,
      .edit-form textarea {
        padding: 0.5rem;
        border-radius: 5px;
        border: 1px solid #ccc;
        width: 100%;
        box-sizing: border-box;
      }
      .edit-form button {
        align-self: flex-end;
        padding: 0.5rem 1rem;
        border: none;
        background-color: #007bff;
        color: white;
        border-radius: 5px;
        cursor: pointer;
      }
      .edit-form button:hover {
        background-color: #0056b3;
      }
    `,
  ],
})
export class EditEntityFormComponent implements OnChanges {
  @Input() entity!: any;
  @Input() fields: FieldConfig[] = [];
  @Input() submitFn!: (updated: any) => Observable<any>;

  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private modalService: ModalService,
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['entity'] && this.entity && this.fields?.length) {
      const group: any = {};
      this.fields.forEach((f) => {
        group[f.name] = [this.entity[f.name] || '', f.validators || []];
      });
      this.form = this.fb.group(group);
    }
  }

  submit() {
    if (!this.form.valid || !this.submitFn) return;

    this.submitFn(this.form.value).subscribe(() => {
      this.modalService.close();
    });
  }
}
