import { Injectable } from '@angular/core';
import { Task } from '../models/task.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = 'http://localhost:3000/api/tasks';

  constructor(private http: HttpClient) {}

  getTasks() {
    return this.http.get<Task[]>(this.apiUrl);
  }
  createTask(task: Task) {
    return this.http.post<Task>(this.apiUrl, task);
  }
  getTaskById(id: string): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`);
  }
  updateTask(id: string, task: Partial<Task>): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, task);
  }
  deleteTask(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

}
