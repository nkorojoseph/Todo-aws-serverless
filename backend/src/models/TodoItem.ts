export interface TodoItem {
  userId: string
  createdAt: string
  todoId: string
  name: string
  dueDate: string
  done: boolean
  attachmentUrl?: string
}
