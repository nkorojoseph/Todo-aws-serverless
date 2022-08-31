import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
//import { cors } from 'middy/middlewares'

import { getTodosForUser } from '../../businessLogic/todos'
//import { getUserId } from '../utils';
import { getToken } from '../../auth/utils'

import { createLogger } from '../../utils/logger';
import { TodoItem } from './../../models/TodoItem';
const logger = createLogger('getTodos');

// TODO: Get all TODO items for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing GetTodos event...');
    // Write your code here
    const jwtToken: string = getToken(event);
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    };

    try {
      const todosList: TodoItem[] = await getTodosForUser(jwtToken)
      logger.info('Successfully retrieved todolist');
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ todosList })
      };
    } catch (error) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error })
      };
    }

 })

 