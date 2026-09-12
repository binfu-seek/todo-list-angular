import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodoListComponent } from './todo-list';
import { signal } from '@angular/core';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { TodoService } from '../../services/todo.servise';
import { Todo } from '../../models/todo.models';

describe('TodoListComponent', () => {
  let component: TodoListComponent;
  let fixture: ComponentFixture<TodoListComponent>;

  const todoServiceMock = {
    todos$: signal<Todo[]>([]),
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
  describe('Basic tests', () => {
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

    // Form validations such as required, max length, and min length should be tested in real projects, but for brevity, we will skip those here.

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
  });

  // Error handling tests

  describe('Error Handling', () => {

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

  describe('UI rendering', () => {
    it('should render the title input', () => {
      todoServiceMock.todos$.set([
        { guid: '1', title: 'Test Todo 1', description: 'Description 1', status: 'New', createdAt: new Date(), notes: '' },
        { guid: '2', title: 'Test Todo 2', description: 'Description 2', status: 'InProgress', createdAt: new Date(), notes: '' }
      ]);

      fixture.detectChanges();
      const items = fixture.nativeElement.querySelectorAll('.todo-item');
      expect(items.length).toBe(2);
      expect(items[0].textContent).toContain('Test Todo 1');
      expect(items[1].textContent).toContain('Test Todo 2');
      expect(items[0].textContent).toContain('Description 1');
      expect(items[1].textContent).toContain('Description 2');      
    });

    it('should delete item when clicking delete button', () => {
      todoServiceMock.todos$.set([
        { guid: '1', title: 'Test Todo 1', description: 'Description 1', status: 'New', createdAt: new Date(), notes: '' },
      ]);
      fixture.detectChanges();
      const deleteButton = fixture.nativeElement.querySelector('.todo-actions button');
      expect(deleteButton).toBeTruthy();
      deleteButton.click();
      expect(todoServiceMock.deleteTodo).toHaveBeenCalledWith('1');
    });

    it('should submit form when clicking submit button', () => {

      fixture.detectChanges();
      const titleInput = fixture.nativeElement.querySelector('input[formControlName="title"]');
      const descriptionInput = fixture.nativeElement.querySelector('input[formControlName="description"]');

      const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');

      titleInput.value = 'New Todo';
      titleInput.dispatchEvent(new Event('input'));
      descriptionInput.value = 'New Description';
      descriptionInput.dispatchEvent(new Event('input'));

      fixture.detectChanges();

      submitButton.click();

      expect(todoServiceMock.addTodo).toHaveBeenCalledWith({ title: 'New Todo', description: 'New Description' });
    });

    it('should apply hover effect when mouse enters todo item', () => {
      todoServiceMock.todos$.set([
        { guid: '1', title: 'Test Todo 1', description: 'Description 1', status: 'New', createdAt: new Date(), notes: '' },
      ]);
      fixture.detectChanges();
      const todoItem = fixture.nativeElement.querySelector('.todo-item');
      todoItem.dispatchEvent(new Event('mouseenter'));
      fixture.detectChanges();
      expect(component.hoveredTodoGuid).toBe('1');
    });

    it('should remove hover effect when mouse leaves todo item', () => {
      todoServiceMock.todos$.set([
        { guid: '1', title: 'Test Todo 1', description: 'Description 1', status: 'New', createdAt: new Date(), notes: '' },
      ]);
      fixture.detectChanges();
      const todoItem = fixture.nativeElement.querySelector('.todo-item');
      todoItem.dispatchEvent(new Event('mouseleave'));
      fixture.detectChanges();
      expect(component.hoveredTodoGuid).toBeNull();
    });
  });
});
