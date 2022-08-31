import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
//import { cors, httpErrorHandler } from 'middy/middlewares'
import { updateTodo } from '../../businessLogic/todos'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
//import { getUserId } from '../utils'
import { getToken } from '../../auth/utils'
import { createLogger } from '../../utils/logger';
const logger = createLogger('updateTodo');

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing UpdateTodo event...');
    const todoId = event.pathParameters.todoId
    const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
    const jwtToken: string = getToken(event);
    // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    };
    try {
      await updateTodo(jwtToken, todoId, updatedTodo);
      logger.info(`Successfully updated the todo item: ${todoId}`);
      return {
        statusCode: 204,
        headers,
        body: undefined
      };
    } catch (error) {
      logger.error(`Error: ${error.message}`);
      return {
        statusCode: 500,
        body: JSON.stringify({ error })
      };
    }
  }
)

