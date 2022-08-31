import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosAccess')

// TODO: Implement the dataLayer logic

export class TodosAccess {

    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly todosTable = process.env.TODOS_TABLE,
        
    ){
    }

    async getTodos(userId: string):Promise<TodoItem[]> {
        
       const result = await this.docClient.query({
        TableName: this.todosTable,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
        }
      }).promise()

       const todos = result.Items
       logger.info('Getting all todo items', todos);
       return todos as TodoItem[]
    }

    async getTodo(userId: string, todoId: string): Promise<TodoItem> {
        logger.info(`Getting todo item: ${todoId}`);
        const result = await this.docClient
          .query({
            TableName: this.todosTable,
            KeyConditionExpression: 'userId = :userId and todoId = :todoId',
            ExpressionAttributeValues: {
              ':userId': userId,
              ':todoId': todoId
            }
          })
          .promise();
        const todoItem = result.Items[0];
        return todoItem as TodoItem;
      }


    async createTodo(newTodo:TodoItem):Promise<TodoItem>{
        logger.info(`Creating new todo item: ${newTodo.todoId}`);
        await this.docClient.put({
            TableName: this.todosTable,
            Item: newTodo 
        }).promise()

        return newTodo as TodoItem;
    }


    async updateTodo(userId: string, todoId: string, updateData: TodoUpdate): Promise<void> {
        logger.info(`Updating a todo item: ${todoId}`);
        await this.docClient
          .update({
            TableName: this.todosTable,
            Key: { userId, todoId },
            ConditionExpression: 'attribute_exists(todoId)',
            UpdateExpression: 'set #n = :n, dueDate = :due, done = :dn',
            ExpressionAttributeNames: { '#n': 'name' },
            ExpressionAttributeValues: {
              ':n': updateData.name,
              ':due': updateData.dueDate,
              ':dn': updateData.done
            }
          })
          .promise();
      }

      async deleteTodo(userId: string, todoId: string): Promise<void> {
        await this.docClient
          .delete({
            TableName: this.todosTable,
            Key: { userId, todoId }
          })
          .promise();
      }

    

}

// function createDynamoDBClient(){
//     if(process.env.IS_OFFLINE){
//         console.log('Creating a local DynamoDB instance')
//         return new XAWS.DynamoDB.DocumentClient({
//             region: 'localhost',
//             endpoint: 'http://localhost:8000'
//           })
//         }      
//         return new XAWS.DynamoDB.DocumentClient()
// }