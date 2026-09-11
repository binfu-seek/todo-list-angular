import { Component, OnInit } from '@angular/core';
import { TodoService } from '../../services/todo.servise';
import { ReactiveFormsModule, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CreateTodoRequest } from '../../models/todo.models';
import { NgClass } from '@angular/common';

@Component({
  imports: [ReactiveFormsModule, NgClass],
  selector: 'app-todo-list',
  styleUrl: './todo-list.scss',
  templateUrl: './todo-list.html',
})
export class TodoListComponent implements OnInit {
  get todos() {
    return this.todoService.todos$;
  }

  constructor(
    private readonly todoService: TodoService,
    private readonly fb: FormBuilder
  ) {
    this.todoForm = this.fb.nonNullable.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: [''],
    });
  }
  // readonly todos = this.todoService.todos$;
  
  todoForm!: FormGroup<{
    title: FormControl<string>;
    description: FormControl<string>;
  }>;

  hoveredTodoGuid: string | null = null;

  ngOnInit() {
    this.todoService.loadTodos().subscribe();
  }

  onSubmit() {
    if (this.todoForm.valid) {
      const newTodo = this.todoForm.value as CreateTodoRequest;
      this.todoService.addTodo(newTodo).subscribe(() => {
        this.todoForm.reset();
      });
    }
  } 

  deleteTodo(guid: string) {
    this.todoService.deleteTodo(guid).subscribe();
  }

  onHover(guid: string | null) {
    this.hoveredTodoGuid = guid;
  }

  onLeave() {
    this.hoveredTodoGuid = null;
  }
}
