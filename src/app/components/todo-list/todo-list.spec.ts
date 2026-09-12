import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodoListComponent } from './todo-list';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { TodoService } from '../../services/todo.servise';

describe('TodoListComponent', () => {
  let component: TodoListComponent;
  let fixture: ComponentFixture<TodoListComponent>;

  const todoServiceMock = {
    todos$: signal([]),
    loadTodos: vi.fn(() => of([])),
    addTodo: vi.fn(() => of({})),
    deleteTodo: vi.fn(() => of({})),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoListComponent],
      providers: [
        { provide: TodoService, useValue: todoServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TodoListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
