import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
//import { cors, httpErrorHandler } from 'middy/middlewares'
import { createLogger } from '../../utils/logger';
import { createAttachmentPresignedUrl } from '../../dataLayer/attachmentUtils'
//import { getUserId } from '../utils'
import { getToken } from '../../auth/utils'

const logger = createLogger('GenerateUploadUrl');

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing GenerateUploadUrl event...');
    const todoId = event.pathParameters.todoId
    // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    };
    const jwtToken: string = getToken(event);

    try {
      const signedUrl: string = await createAttachmentPresignedUrl(jwtToken, todoId);
      logger.info('Successfully created signed url.');
      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({ uploadUrl: signedUrl })
      };
    } catch (error) {
      logger.error(`Error: ${error}`);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error })
      };
    }
  }
)

