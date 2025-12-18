import { Injectable, inject } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private socket: Socket | null = null;
  private remindersSubject = new BehaviorSubject<any[]>([]);
  reminders$ = this.remindersSubject.asObservable();
  private snackBar = inject(MatSnackBar);

  connect(userId: string) {
    console.log('Attempting to connect to notification server...');

    this.socket = io('http://localhost:3000', {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      transports: ['websocket', 'polling'],
    });

    this.socket.on('connect', () => {
      console.log('Connected to notification server');
      this.socket?.emit('register-user', userId);
      this.snackBar.open('Connected to notification service', 'Close', {
        duration: 2000,
      });
    });

    this.socket.on('reminder', (data) => {
      console.log('🔔 Reminder received:', data);
      this.snackBar.open(`🔔 ${data.message}`, 'Close', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['reminder-snackbar'],
      });

      const reminders = this.remindersSubject.value;
      this.remindersSubject.next([...reminders, data]);
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Disconnected from notification server');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
