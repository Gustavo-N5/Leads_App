import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { LeadService } from '../../../core/services/lead.service';
import { Lead, LEAD_STATUSES, LEAD_STATUS_LABELS } from '../../../core/models/lead.model';

@Component({
  selector: 'app-lead-form-dialog',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatButtonModule, MatProgressSpinnerModule, MatIconModule
  ],
  styleUrls: ['./lead-form-dialog.component.scss'],
  templateUrl: './lead-form-dialog.component.html'
})
export class LeadFormDialogComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  isEdit = false;
  statuses = LEAD_STATUSES;
  statusLabels = LEAD_STATUS_LABELS;

  constructor(
    private fb: FormBuilder,
    private leadService: LeadService,
    private dialogRef: MatDialogRef<LeadFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Lead | null
  ) {}

  ngOnInit(): void {
    this.isEdit = !!this.data;
    this.form = this.fb.group({
      name: [this.data?.name ?? '', [Validators.required, Validators.minLength(3)]],
      email: [this.data?.email ?? '', [Validators.required, Validators.email]],
      status: [this.data?.status ?? 'New', Validators.required]
    });
  }

  submit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    const req = this.isEdit
      ? this.leadService.update(this.data!.id, this.form.value)
      : this.leadService.create(this.form.value);
    req.subscribe({ next: r => this.dialogRef.close(r), error: () => this.loading = false });
  }
}