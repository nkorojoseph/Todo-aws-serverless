import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getTodo } from '../../businessLogic/todos'
//import { getUserId } from '../utils';
import { getToken } from '../../auth/utils'

// TODO: Get all TODO items for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId;
    // Write your code here
    const jwtToken: string = getToken(event);
    

    try {
      const todo = await getTodo(jwtToken,todoId)
      return {
        statusCode: 200,
        body: JSON.stringify({ todo })
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error })
      };
    }

 })

 handler.use(
  cors({
    credentials: true
  })
)
