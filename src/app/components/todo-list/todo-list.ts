import { Component, OnInit, signal } from '@angular/core';
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
      title: ['', [Validators.required, Validators.maxLength(100), Validators.minLength(3)]],
      description: [''],
    });
  }
  // readonly todos = this.todoService.todos$;
  
  todoForm!: FormGroup<{
    title: FormControl<string>;
    description: FormControl<string>;
  }>;

  hoveredTodoGuid: string | null = null;
  errorMessage = signal<string | null>(null);

  ngOnInit() {
    this.todoService.loadTodos().subscribe({
      next: () => {
        this.errorMessage.set(null);
      },
      error: (error) => {
        console.log('Error loading todos:', error);
        this.errorMessage.set(error.error.detail || 'An error occurred while loading todos.');
        debugger;
      }
    });
  }

  onSubmit() {
    if (this.todoForm.valid) {
      const newTodo = this.todoForm.value as CreateTodoRequest;
      this.todoService.addTodo(newTodo).subscribe({
        next: () => {
          this.todoForm.reset();
          this.errorMessage.set(null);
        },
        error: (error) => {
          this.errorMessage.set(error.error.detail || 'An error occurred while adding the todo.');
          debugger;
        }
      });
    }
  } 

  deleteTodo(guid: string) {
    this.todoService.deleteTodo(guid).subscribe({
      next: () => {
        this.errorMessage.set(null);
      },
      error: (error) => {
        this.errorMessage.set(error.error.detail || 'An error occurred while deleting the todo.');
        debugger;
      }
    });
  }

  onHover(guid: string | null) {
    this.hoveredTodoGuid = guid;
  }

  onLeave() {
    this.hoveredTodoGuid = null;
  }
}
