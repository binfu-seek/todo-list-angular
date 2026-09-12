import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { TodoService } from "./todo.servise";
import { TestBed } from "@angular/core/testing";
import { vi } from 'vitest';
import { environment } from "../../environments/environment";
import { CreateTodoRequest } from "../models/todo.models";

describe('TodoService', () => {
  let service: TodoService;
  let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [TodoService]
        });
        service = TestBed.inject(TodoService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should load todos', () => {
        const mockTodos = [
            { guid: '1', title: 'Test Todo 1', description: 'Description 1' },
            { guid: '2', title: 'Test Todo 2', description: 'Description 2' }
        ];

        service.loadTodos().subscribe((todos) => {
            expect(todos).toEqual(mockTodos);
        });

        const req = httpMock.expectOne(`${environment.apiUrl}/todo`);
        expect(req.request.method).toBe('GET');
        req.flush(mockTodos);
        expect(service.todos$()).toEqual(mockTodos);
    });

    it('should add a todo', () => {
        const newTodo = { title: 'New Todo', description: 'New Description' } as CreateTodoRequest;
        const mockResponse = { guid: '3', ...newTodo };

        service.addTodo(newTodo).subscribe((todo) => {
            expect(todo).toEqual(mockResponse);
        });

        const req = httpMock.expectOne(`${environment.apiUrl}/todo`);
        expect(req.request.method).toBe('POST');
        req.flush(mockResponse);
        expect(service.todos$()).toContainEqual(mockResponse);
    });

    it('should delete a todo', () => {
        const guidToDelete = '1';
        const mockResponse = { guid: '1', title: 'New Todo', description: 'New Description' };

        service.deleteTodo(guidToDelete).subscribe((todo) => {
            expect(todo).toEqual(mockResponse);
        });

        const req = httpMock.expectOne(`${environment.apiUrl}/todo/${guidToDelete}`);
        expect(req.request.method).toBe('DELETE');
        req.flush(mockResponse);
        expect(service.todos$()).not.toContainEqual({ guid: guidToDelete });
    });
});