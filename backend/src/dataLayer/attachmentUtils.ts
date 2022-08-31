import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { parseUserId } from '../auth/utils';

const XAWS = AWSXRay.captureAWS(AWS)

// TODO: Implement the fileStogare logic

const docClient = new XAWS.DynamoDB.DocumentClient()
const s3 = new XAWS.S3({
  signatureVersion: 'v4'
})

const todosTable = process.env.TODOS_TABLE
const bucketName = process.env.ATTACHMENT_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

export const  saveImgUrl= async (userId: string, todoId: string, bucketName: string): Promise<void> => {
    await docClient
      .update({
        TableName: todosTable,
        Key: { userId, todoId },
        ConditionExpression: 'attribute_exists(todoId)',
        UpdateExpression: 'set attachmentUrl = :attachmentUrl',
        ExpressionAttributeValues: {
          ':attachmentUrl': `https://${bucketName}.s3.amazonaws.com/${todoId}`
        }
      })
      .promise();
  }

export const createAttachmentPresignedUrl = async (jwtToken: string, todoId: string) => {
    const signedUrl = s3.getSignedUrl('putObject', {
      Bucket: bucketName,
      Key: todoId,
      Expires: parseInt(urlExpiration,10) 
    })
    const userId = parseUserId(jwtToken)
    await saveImgUrl(userId, todoId, bucketName);
    return signedUrl
    }


// async function todoExists(todoId: string) {
// const result = await docClient
//     .get({
//     TableName: todosTable,
//     Key: {
//         id: todoId
//     }
//     })
//     .promise()
// console.log('Get group: ', result)
// return !!result.Item
// }


// async function createImage(todoId: string, imageId: string, event: any) {
//     const timestamp = new Date().toISOString()
//     const newImage = JSON.parse(event.body)
  
//     const newItem = {
//       todoId,
//       timestamp,
//       imageId,
//       ...newImage,
//       imageUrl: `https://${bucketName}.s3.amazonaws.com/${imageId}`
//     }
//     console.log('Storing new item: ', newItem)
  
//     await docClient
//       .put({
//         TableName: todosTable,
//         Item: newItem
//       })
//       .promise()
  
//     return newItem
//   }