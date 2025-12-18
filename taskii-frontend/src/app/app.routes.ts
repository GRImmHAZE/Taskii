import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./components/task-list/task-list').then(m => m.TaskList)
    },
    {
        path: 'add',
        loadComponent: () => import('./components/task-form/task-form').then(m => m.TaskForm)
    },
    {
        path: 'edit/:id',
        loadComponent: () => import('./components/task-edit/task-edit').then(m => m.TaskEdit)
    }
];
