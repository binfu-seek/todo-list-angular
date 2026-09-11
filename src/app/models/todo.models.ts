export interface CreateTodoRequest {
  title: string;
  description: string;
  notes: string;
}

export interface Todo {
  guid: string;
  title: string;
  description: string;
  status: 'New' | 'Done' | 'InProgress' | 'Pending' | 'Cancelled';
  createdAt: Date;
  notes: string;
}