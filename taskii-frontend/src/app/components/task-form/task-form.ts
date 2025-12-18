import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { firstValueFrom } from 'rxjs';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-form',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatSnackBarModule,
    MatIcon
  ],
  templateUrl: './task-form.html',
  styleUrl: './task-form.scss',
})
export class TaskForm {
  task: Task = {
    title: '',
    description: '',
    category: 'Personal',
    deadline: new Date(),
    importance: 3
  };

  constructor(
    private taskService: TaskService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  async saveTask() {
    try {
      const userId = localStorage.getItem('userId') || 'guest-user';
      const taskData = {
        ...this.task,
        userId: userId,
        userEmail: 'example@gmail.com',
        notificationSent: false
      };
      
      await firstValueFrom(this.taskService.createTask(taskData));
      this.snackBar.open('Task created successfully!', 'Close', { duration: 2000 });
      setTimeout(() => this.router.navigate(['/']), 500);
    } catch (error) {
      console.error('Error creating task:', error);
      this.snackBar.open('Error creating task', 'Close', { duration: 2000 });
    }
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
