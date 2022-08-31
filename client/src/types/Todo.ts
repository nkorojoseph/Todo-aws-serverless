export interface Todo {
  userId: string
  createdAt: string
  todoId: string
  name: string
  dueDate: string
  done: boolean
  attachmentUrl?: string
}

export interface GetTodosResp {
  todoList: Todo[];
}

export interface GetTodoResp {
  todoItem: Todo[];
}

export interface CreateTodoResp {
  newTodo: Todo;
}