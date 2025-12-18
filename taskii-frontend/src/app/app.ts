import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NotificationService } from './services/notification-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatToolbar, RouterModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit, OnDestroy {
  protected readonly title = signal('taskii-frontend');

  private notificationService = inject(NotificationService);

  ngOnInit() {
    const userId = localStorage.getItem('userId') || 'guest-user';
    this.notificationService.connect(userId);
  }

  ngOnDestroy() {
    this.notificationService.disconnect();
  }
}
