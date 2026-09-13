# AngularTodoApp

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 22.1.8.

## Overview

This TODO list project implemented using Angular 22. It retrieves, creates, and deletes todo items through a REST API.

### Features

- Load todos from the API
- Add todos with title and description
- Delete todos
- Form validation for title field (not null, length between 3 and 100 charactors)
- Display API errors
- Hover todo item to show/hide delete button

### Technology stack

- Angular 22 and Typescript
    - RxJS
    - Reactive Forms
    - Angular Signals
- SCSS
- Vitest unit tests
- REST API integration

## Backend API integration

### Base URL Configuration

The base URL is configured in `environment.ts`. Please replace it wht the real API base URL.

### API endpoints

The frontend app use below endpoints to load, create, and delete todo items
- **GET** -  `/api/todo` - Load all todos
- **POST** -  `/api/todo` - Create a todos
- **DELETE** -  `/api/todo/{guid}` - Delete a todos

### Unit tests

The unit tests use Vitests framework. The test cases mainly covers below areas:
- Todo-list component behaviors
- Todo-list component DOM rendering
- Todo service behaviors
- Form validation is partially covered 

## Considerations and further improvements

- **Unused fields**   
  
Currently for each todo item, only the Title and Description fields are displayed. There are other fields such as CreatedAt, Notes, and Status defined in the domain model, and they can be rendered on UI later if needed.

- **Single component vs multiple components**   
   
Currently everything is in one entire todo-list component for the simplicity of demonstration. In real projects, we can break it down into smaller components, such as individual todo component, form component, error component, etc.  

- **Loading indicator**  
  
Loading indicators (such as a spinner when waiting for API response) is not implemented. It needs to be added in future enhancements.  

- **Pagination**  

Pagination is not implemented on either front or backend for now, and will be added if clear defined requirements finalizes in the future.

- **Routing**  

Routing is not implemented since there is only one whole component. But in the future if the form need to be displayed in a separate page, we can configure routing for it, so that when user refresh the page, they can stay on the form page rather than being forced back to the todo list page.

- **Caching**  

The current app stores todos in-memory using Angular Signal. We could potentially add service level caching to prevent repetitive API calls, or use to use `sessionStorage` to persist data between page refresh.

- **Accessibility**  

Accessibility is partially supported via semantic HTML elements, but `aria-xxx` attributes are not specifically added. The delete buttons which are only visible on hover may need to be adjusted to improve accessibility. 

## Run app locally

For newly cloned repo, install npm packages:

```bash
npm install
```

To start a local development server, run:

```bash
ng serve
```

> **Note**: to run this Angular 22 project, it requires node.js version 22.22.3 or above to be installed.

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```
