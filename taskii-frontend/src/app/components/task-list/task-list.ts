import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription, firstValueFrom } from 'rxjs';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatListModule,
    MatSnackBarModule,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule
  ],
  templateUrl: './task-list.html',
  styleUrl: './task-list.scss',
})
export class TaskList implements OnInit, OnDestroy {
  private snackBar = inject(MatSnackBar);
  private taskService = inject(TaskService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  private subs = new Subscription();

  // Filter options
  selectedCategory: string = 'All';
  selectedPriority: string = 'All';
  categories: string[] = ['All', 'Work', 'Personal', 'Study'];
  priorities: string[] = ['All', 'High', 'Normal'];


  async ngOnInit() {
    await this.fetchTasks();

    // Refetch when you navigate back to this route
    const navSub = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        setTimeout(() => this.fetchTasks(), 100);
      });
    
    this.subs.add(navSub);
  }

  async fetchTasks() {
    try {
      const data = await firstValueFrom(this.taskService.getTasks());
      setTimeout(() => {
        this.tasks = data;
        this.applyFiltersAndSort();
        console.log(this.tasks, "tasks");
        this.checkUpcomingDeadlines();
      }, 100);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  }

  applyFiltersAndSort() {
    let filtered = [...this.tasks];

    // Filter by category
    if (this.selectedCategory !== 'All') {
      filtered = filtered.filter(task => task.category === this.selectedCategory);
    }

    // Filter by priority
    if (this.selectedPriority !== 'All') {
      const isHighPriority = this.selectedPriority === 'High';
      filtered = filtered.filter(task => (task.importance! >= 4) === isHighPriority);
    }

    // Sort by priority (high first) then by deadline
    filtered.sort((a, b) => {
      if (a.importance !== b.importance) {
        return (b.importance || 0) - (a.importance || 0);
      }
      const dateA = new Date(a.deadline).getTime();
      const dateB = new Date(b.deadline).getTime();
      return dateA - dateB;
    });

    this.filteredTasks = filtered;
    this.cdr.markForCheck();
  }

  onFilterChange() {
    this.applyFiltersAndSort();
  }

  goToAdd() {
    this.router.navigate(['/add']);
  }

  async deleteTask(taskId: string) {
    try {
      await firstValueFrom(this.taskService.deleteTask(taskId));
      this.snackBar.open('Task deleted', 'Close', { duration: 2000 });
      setTimeout(() => this.fetchTasks(), 100);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  }

  editTask(taskId: string) {
    this.router.navigate(['/edit', taskId]);
  }

  checkUpcomingDeadlines() {
    const now = new Date().getTime();
    const oneDay = 24 * 60 * 60 * 1000;
    this.tasks.forEach((task: any) => {
      const deadline = new Date(task.deadline).getTime();
      if (deadline - now <= oneDay && deadline > now) {
        this.snackBar.open(`Reminder: "${task.title}" is due soon!`, 'Close', { duration: 5000 });
      }
    });
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
