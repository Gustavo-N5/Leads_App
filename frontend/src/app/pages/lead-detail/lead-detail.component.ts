import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { Subject, takeUntil } from 'rxjs';
import { LeadService } from '../../core/services/lead.service';
import { TaskService } from '../../core/services/task.service';
import {
  Lead,
  LEAD_STATUS_LABELS,
  LeadStatus,
} from '../../core/models/lead.model';
import {
  TaskItem,
  TASK_STATUS_LABELS,
  TaskStatus,
} from '../../core/models/task.model';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { TaskFormDialogComponent } from './task-form-dialog/task-form-dialog.component';

@Component({
  selector: 'app-lead-detail',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressBarModule,
    MatMenuModule,
    MatDividerModule,
    MatTooltipModule,
    MatChipsModule,
    NavbarComponent,
  ],
  templateUrl: './lead-detail.component.html',
  styleUrls: ['./lead-detail.component.scss'],
})
export class LeadDetailComponent implements OnInit, OnDestroy {
  lead: Lead | null = null;
  tasks: TaskItem[] = [];
  loading = true;
  tasksLoading = false;
  private destroy$ = new Subject<void>();
  statusLabels = LEAD_STATUS_LABELS;
  taskStatusLabels = TASK_STATUS_LABELS;

  taskGroups: {
    status: TaskStatus;
    label: string;
    icon: string;
    color: string;
  }[] = [
    {
      status: 'Todo',
      label: 'A Fazer',
      icon: 'radio_button_unchecked',
      color: 'todo',
    },
    { status: 'Doing', label: 'Em Andamento', icon: 'pending', color: 'doing' },
    { status: 'Done', label: 'Concluído', icon: 'check_circle', color: 'done' },
  ];

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private leadService: LeadService,
    private taskService: TaskService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadLead(id);
    this.loadTasks(id);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadLead(id: number): void {
    this.leadService.getById(id).subscribe({
      next: (l) => {
        this.lead = l;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.router.navigate(['/leads']);
      },
    });
  }

  loadTasks(id: number): void {
    this.tasksLoading = true;
    this.taskService.getAll(id).subscribe({
      next: (t) => {
        this.tasks = t;
        this.tasksLoading = false;
      },
      error: () => (this.tasksLoading = false),
    });
  }

  getTasksByStatus(status: TaskStatus): TaskItem[] {
    return this.tasks.filter((t) => t.status === status);
  }

  openCreateTask(): void {
    this.dialog
      .open(TaskFormDialogComponent, {
        width: '480px',
        panelClass: 'no-padding-dialog',
      })
      .afterClosed()
      .subscribe((r) => {
        if (r) {
          this.taskService.create(this.lead!.id, r).subscribe(() => {
            this.loadTasks(this.lead!.id);
            this.snackBar.open('Task criada!', 'OK', { duration: 3000 });
          });
        }
      });
  }

  openEditTask(task: TaskItem): void {
    this.dialog
      .open(TaskFormDialogComponent, {
        width: '480px',
        data: task,
        panelClass: 'no-padding-dialog',
      })
      .afterClosed()
      .subscribe((r) => {
        if (r) {
          this.taskService.update(this.lead!.id, task.id, r).subscribe(() => {
            this.loadTasks(this.lead!.id);
            this.snackBar.open('Task atualizada!', 'OK', { duration: 3000 });
          });
        }
      });
  }

  confirmDeleteTask(task: TaskItem): void {
    this.dialog
      .open(ConfirmDialogComponent, {
        data: {
          title: 'Excluir Task',
          message: `Excluir "${task.title}"?`,
          confirmText: 'Excluir',
        },
      })
      .afterClosed()
      .subscribe((confirmed) => {
        if (confirmed)
          this.taskService.delete(this.lead!.id, task.id).subscribe(() => {
            this.loadTasks(this.lead!.id);
            this.snackBar.open('Task excluída.', 'OK', { duration: 3000 });
          });
      });
  }

  quickUpdateStatus(task: TaskItem, status: TaskStatus): void {
    this.taskService
      .update(this.lead!.id, task.id, {
        title: task.title,
        dueDate: task.dueDate,
        status,
      })
      .subscribe(() => this.loadTasks(this.lead!.id));
  }

  getLeadStatusClass(): string {
    return 'badge-' + (this.lead?.status ?? '').toLowerCase();
  }
  getLeadStatusLabel(): string {
    return this.statusLabels[this.lead?.status as LeadStatus] ?? '';
  }
  isOverdue(dueDate?: string): boolean {
    if (!this.hasValidDueDate(dueDate)) return false;
    return new Date(dueDate!) < new Date();
  }

  hasValidDueDate(dueDate?: string): boolean {
    return (
      !!dueDate && dueDate !== 'null' && !isNaN(new Date(dueDate).getTime())
    );
  }
}
