import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodoListComponent } from './todo-list';
import { signal } from '@angular/core';
import { of, throwError } from 'rxjs';
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
    vi.clearAllMocks();
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

  // Basic tests

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load todos on init', () => {
    component.ngOnInit();
    expect(todoServiceMock.loadTodos).toHaveBeenCalled();
  });

  // Add todo tests

  it('should add a todo on submit', () => {
    component.todoForm.setValue({ title: 'Test Todo', description: 'Test Description' });
    component.onSubmit();
    expect(todoServiceMock.addTodo).toHaveBeenCalledWith({ title: 'Test Todo', description: 'Test Description' });
  });

  it('should not add a todo if form is invalid', () => {
    component.todoForm.setValue({ title: '', description: 'Test Description' });
    component.onSubmit();
    expect(todoServiceMock.addTodo).not.toHaveBeenCalled();
  });

  // Delete todo test

  it('should delete a todo', () => {
    const guid = 'test-guid';
    component.deleteTodo(guid);
    expect(todoServiceMock.deleteTodo).toHaveBeenCalledWith(guid);
  });

  // Hover state tests

  it('should set hoveredTodoGuid on hover', () => {
    const guid = 'test-guid';
    component.onHover(guid);
    expect(component.hoveredTodoGuid).toBe(guid);
  });

  it('should clear hoveredTodoGuid on leave', () => {
    component.onLeave();
    expect(component.hoveredTodoGuid).toBeNull();
  });

  // Error handling tests

  it('should set error message on loadTodos error', () => {
    const errorResponse = { error: { detail: 'Load error' } };
    todoServiceMock.loadTodos.mockReturnValueOnce(throwError(() => errorResponse));
    component.ngOnInit();
    expect(component.errorMessage()).toBe('Load error');
  });

  it('should set error message on addTodo error', () => {
    const errorResponse = { error: { detail: 'Add error' } };
    todoServiceMock.addTodo.mockReturnValueOnce(throwError(() => errorResponse));
    component.todoForm.setValue({ title: 'Test Todo', description: 'Test Description' });
    component.onSubmit();
    expect(component.errorMessage()).toBe('Add error');
  });

  it('should set error message on deleteTodo error', () => {
    const errorResponse = { error: { detail: 'Delete error' } };
    todoServiceMock.deleteTodo.mockReturnValueOnce(throwError(() => errorResponse));
    component.deleteTodo('test-guid');
    expect(component.errorMessage()).toBe('Delete error');
  });

  it('should clear error message on successful loadTodos', () => {
    component.ngOnInit();
    expect(component.errorMessage()).toBe(null);
  });

  it('should clear error message on successful addTodo', () => {
    component.todoForm.setValue({ title: 'Test Todo', description: 'Test Description' });
    component.onSubmit();
    expect(component.errorMessage()).toBe(null);
  });

  it('should clear error message on successful deleteTodo', () => {
    component.deleteTodo('test-guid');
    expect(component.errorMessage()).toBe(null);
  });
});
