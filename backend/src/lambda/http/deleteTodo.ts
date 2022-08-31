import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { deleteTodo } from '../../businessLogic/todos'
//import { getUserId } from '../utils'
import { getToken } from '../../auth/utils'
//import { createLogger } from '../../utils/logger'


export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    // TODO: Remove a TODO item by id
    const jwtToken: string =  getToken(event)
    
    try {
      await deleteTodo(jwtToken, todoId);
      return {
        statusCode: 204,
        body: undefined
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error })
      };
    }
  }

)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true,
      origin: '*'
    })
  )
