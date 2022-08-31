import { apiEndpoint } from '../config'
import {  Todo } from '../types/Todo';
import { CreateTodoRequest } from '../types/CreateTodoRequest';
import axios from 'axios'
import { UpdateTodoRequest } from '../types/UpdateTodoRequest';
import { Method, AxiosResponse } from 'axios';

async function axRequest<ReqData, RespData>(
  idToken: string,
  path: string,
  method: Method,
  reqBody: ReqData
): Promise<AxiosResponse<RespData>> {
  const url = `${apiEndpoint}/${path}`;
  const data = reqBody ? JSON.stringify(reqBody) : reqBody;
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${idToken}`
  };
  return axios({ method, url, headers, data });
}

export async function getTodos(idToken: string): Promise<Todo[]> {
  
  const response = await axios.get(`${apiEndpoint}/todos`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`
    },
  })
  console.log('Todos in getTodos function line 16:', response.data)
  const todoData:Todo[] = response.data.todosList
  return todoData
}

// export async function getTodos(idToken: string): Promise<Todo[]> {
//   const response: axiosResponse<GetTodosResp> = await axRequest<null, GetTodosResp>(
//     idToken,
//     'todos',
//     'GET',
//     null
//   );
//   return response.data.todoList;
// }

export async function createTodo(
  idToken: string,
  newTodo: CreateTodoRequest
): Promise<Todo> {
  //console.log('create to do', idToken)
  const response = await axios.post(`${apiEndpoint}/todos`,  newTodo, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
    
  })
  
  console.log(response)
  return response.data['newTodo']
}

// export async function createTodo(idToken: string, newTodo: CreateTodoRequest): Promise<Todo> {
//   const response: axiosResponse<CreateTodoRequest> = await axRequest<CreateTodoRequest, CreateTodoRequest>(
//     idToken,
//     'todos',
//     'POST',
//     newTodo
//   );
//   return response.data
// }


export async function getTodo(idToken: string, todoId: string): Promise<Todo> {

  const response = await axios.get(`${apiEndpoint}/todos/${todoId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
    
  })
  console.log('single todo', response)
  return response.data.todo;
}

export async function patchTodo(
  idToken: string,
  todoId: string,
  updatedTodo: UpdateTodoRequest
): Promise<void> {
  await axios.put(`${apiEndpoint}/todos/${todoId}`, JSON.stringify(updatedTodo), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteTodo(
  idToken: string,
  todoId: string
): Promise<void> {
  await axios.delete(`${apiEndpoint}/todos/${todoId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  todoId: string
): Promise<string> {
  console.log('trying to upload getUploadUrl')
  const response = await axios.post(`${apiEndpoint}/todos/${todoId}/attachment`, null, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  console.log(response)
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  console.log('trying to upload')
  await axios.put(uploadUrl, file)
}
