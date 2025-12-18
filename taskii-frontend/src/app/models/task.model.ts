export interface Task {
  _id?: string; // optional — used for updating/deleting existing tasks
  title: string;
  description?: string;
  category: 'Work' | 'Personal' | 'Study';
  deadline: Date;
  importance: number; // 1 = low, 5 = high
  createdAt?: Date;
  updatedAt?: Date;
}
