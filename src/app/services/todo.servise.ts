import { Injectable, signal } from "@angular/core";
import { CreateTodoRequest, Todo } from "../models/todo.models";
import { environment } from "../../environments/environment";
import { tap } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({ providedIn: 'root' })
export class TodoService {

  constructor(private readonly http: HttpClient) {}
  private readonly todos = signal<Todo[]>([]);

  readonly todos$ = this.todos.asReadonly();
  private readonly apiUrl = `${environment.apiUrl}`;

  loadTodos() {
    return this.http.get<Todo[]>(`${this.apiUrl}/todo`).pipe(
      tap((todos: Todo[]) => {
        console.log('Todos loaded:', todos);
        this.todos.set(todos);
      })
    );
  }

  addTodo(request: CreateTodoRequest) {
    return this.http.post<Todo>(`${this.apiUrl}/todo`, request).pipe(
      tap((todo: Todo) => {
        console.log('Todo added:', todo);
        this.todos.update(items => [...items, todo]);
      })
    );
  }

  deleteTodo(guid: string) {
    return this.http.delete(`${this.apiUrl}/todo/${guid}`).pipe(
      tap(() => {
        console.log('Todo deleted:', guid);
        this.todos.update(items => items.filter(x => x.guid !== guid));
      })
    );
  }
}