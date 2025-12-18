import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-edit',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatSnackBarModule
  ],
  templateUrl: './task-edit.html',
  styleUrl: './task-edit.scss',
})
export class TaskEdit implements OnInit {
  private taskService = inject(TaskService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);
  private cdr = inject(ChangeDetectorRef);

  task: Partial<Task> = {
    title: '',
    description: '',
    category: 'Personal',
    importance: 3,
    deadline: new Date()
  };
  taskId: string | null = null;
  isLoading = true;

  ngOnInit() {
    this.taskId = this.route.snapshot.paramMap.get('id');
    console.log('Task ID:', this.taskId);
    if (this.taskId) {
      this.fetchTask();
    }
  }

  fetchTask() {
    this.taskService.getTaskById(this.taskId!).subscribe({
      next: (data) => {
        console.log('Task loaded:', data);
        this.task = data;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error fetching task:', error);
        this.snackBar.open('Error loading task', 'Close', { duration: 2000 });
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  async saveTask() {
    try {
      await firstValueFrom(this.taskService.updateTask(this.taskId!, this.task));
      this.snackBar.open('Task updated successfully!', 'Close', { duration: 2000 });
      setTimeout(() => this.router.navigate(['/']), 500);
    } catch (error) {
      console.error('Error updating task:', error);
      this.snackBar.open('Error updating task', 'Close', { duration: 2000 });
    }
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
