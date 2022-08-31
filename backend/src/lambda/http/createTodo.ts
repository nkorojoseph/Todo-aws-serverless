import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
//import { cors } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
//import { getUserId } from '../utils';
import { createTodo } from '../../businessLogic/todos'
import { createLogger } from '../../utils/logger';
import { TodoItem } from './../../models/TodoItem';
import { getToken } from '../../auth/utils'
const logger = createLogger('createTodo');

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newTodoData: CreateTodoRequest = JSON.parse(event.body)
    // TODO: Implement creating a new TODO item

    const jwtToken: string = getToken(event)
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    };

    //const newItem = await createTodo(newTodo, jwtToken)

    try {
      const newTodo: TodoItem = await createTodo(newTodoData, jwtToken);
      logger.info('Successfully created a new todo item.');
      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({ newTodo })
      };
    } catch (error) {
      logger.error(`Error: ${error.message}`);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error })
      };
    }

  }
)

//handler.use( cors({credentials: true}) )
