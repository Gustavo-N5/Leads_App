import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subject, debounceTime, takeUntil } from 'rxjs';
import { LeadService } from '../../core/services/lead.service';
import {
  Lead,
  LEAD_STATUSES,
  LEAD_STATUS_LABELS,
  LeadStatus,
} from '../../core/models/lead.model';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { LeadFormDialogComponent } from './lead-form-dialog/lead-form-dialog.component';
import { NavbarComponent } from 'src/app/shared/components/navbar/navbar.component';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-leads',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule, // ← adicionar
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatMenuModule, // ← adicionar
    MatDividerModule, // ← adicionar
    NavbarComponent,
  ],
  templateUrl: './leads.component.html',
  styleUrls: ['./leads.component.scss'],
})
export class LeadsComponent implements OnInit, OnDestroy {
  leads: Lead[] = [];
  total = 0;
  page = 1;
  pageSize = 10;
  loading = false;
  displayedColumns = [
    'name',
    'status',
    'tasks',
    'createdAt',
    'actions',
  ];
  filterForm: FormGroup;
  statuses = LEAD_STATUSES;
  statusLabels = LEAD_STATUS_LABELS;
  private destroy$ = new Subject<void>();

  statusColors: Record<LeadStatus, string> = {
    New: 'status-new',
    Qualified: 'status-qualified',
    Won: 'status-won',
    Lost: 'status-lost',
  };

  constructor(
    private leadService: LeadService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private fb: FormBuilder,
  ) {
    this.filterForm = this.fb.group({ search: [''], status: [''] });
  }

  ngOnInit(): void {
    this.load();
    this.filterForm.valueChanges
      .pipe(debounceTime(400), takeUntil(this.destroy$))
      .subscribe(() => {
        this.page = 1;
        this.load();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  load(): void {
    this.loading = true;
    const { search, status } = this.filterForm.value;
    this.leadService
      .getAll({ search, status, page: this.page, pageSize: this.pageSize })
      .subscribe({
        next: (res) => {
          this.leads = res.items;
          this.total = res.total;
          this.loading = false;
        },
        error: () => (this.loading = false),
      });
  }

  openCreate(): void {
    this.dialog
      .open(LeadFormDialogComponent, { width: '500px' })
      .afterClosed()
      .subscribe((r) => {
        if (r) {
          this.load();
          this.snackBar.open('Lead criado!', 'OK', { duration: 3000 });
        }
      });
  }

  openEdit(lead: Lead): void {
    this.dialog
      .open(LeadFormDialogComponent, { width: '500px', data: lead })
      .afterClosed()
      .subscribe((r) => {
        if (r) {
          this.load();
          this.snackBar.open('Lead atualizado!', 'OK', { duration: 3000 });
        }
      });
  }

  confirmDelete(lead: Lead): void {
    this.dialog
      .open(ConfirmDialogComponent, {
        data: {
          title: 'Excluir Lead',
          message: `Deseja excluir "${lead.name}"?`,
          confirmText: 'Excluir',
        },
      })
      .afterClosed()
      .subscribe((confirmed) => {
        if (confirmed)
          this.leadService.delete(lead.id).subscribe(() => {
            this.load();
            this.snackBar.open('Lead excluído.', 'OK', { duration: 3000 });
          });
      });
  }

  goToDetail(id: number): void {
    this.router.navigate(['/leads', id]);
  }

  onPageChange(e: PageEvent): void {
    this.page = e.pageIndex + 1;
    this.pageSize = e.pageSize;
    this.load();
  }

  clearFilters(): void {
    this.filterForm.reset({ search: '', status: '' });
  }

  getStatusColor(status: string): string {
    return this.statusColors[status as LeadStatus] ?? '';
  }
  getStatusLabel(status: string): string {
    return this.statusLabels[status as LeadStatus] ?? status;
  }
  getChipClasses(s: LeadStatus): Record<string, boolean> {
    return {
      'chip-active': this.filterForm.get('status')?.value === s,
      ['chip-' + s.toLowerCase()]: true,
    };
  }
}
