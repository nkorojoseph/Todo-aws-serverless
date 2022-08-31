import { TodosAccess } from '../dataLayer/todosAcess'
//import { AttachmentUtils } from './attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
//import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
//import * as createError from 'http-errors'
//import { getUserId } from '../lambda/utils'
import { parseUserId } from '../auth/utils'

// TODO: Implement businessLogic
const todoAccess = new TodosAccess()

export const getTodosForUser = async (jwtToken: string): Promise<TodoItem[]> => {
  const userId: string = parseUserId(jwtToken);
  return todoAccess.getTodos(userId);
}

export async function getTodo(jwtToken: string, todoId: string): Promise<TodoItem> {
  const userId: string = parseUserId(jwtToken);
  return todoAccess.getTodo(userId, todoId);
}

export const createTodo = async (newTodoData: CreateTodoRequest,jwtToken: string): Promise<TodoItem> => {
  const todoId = uuid.v4()
  const userId = parseUserId(jwtToken)
  const createdAt = new Date().toISOString();
  const done = false;
  const newTodo: TodoItem = { todoId, userId, createdAt, done, ...newTodoData };
  return todoAccess.createTodo(newTodo);
}


export const updateTodo = (jwtToken: string,
  todoId: string,
  updateData: UpdateTodoRequest): Promise<void> => {
    const userId = parseUserId(jwtToken);
    return todoAccess.updateTodo(userId, todoId, updateData);
}


export const deleteTodo = (jwtToken: string,
  todoId: string): Promise<void> => {
    const userId = parseUserId(jwtToken);
  return todoAccess.deleteTodo(userId, todoId);
}




  