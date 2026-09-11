import { Component, OnInit } from '@angular/core';
import { TodoService } from '../../services/todo.servise';

@Component({
  imports: [],
  selector: 'app-todo-list',
  styleUrl: './todo-list.scss',
  templateUrl: './todo-list.html',
})
export class TodoListComponent implements OnInit {
  constructor(private readonly todoService: TodoService) {}

  ngOnInit() {
    this.todoService.loadTodos().subscribe();
  }
}
