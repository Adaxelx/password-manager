export type User = {
  id: number
  name: string
} & UserCredentials

export type UserCredentials = {
  email: string
  password: string
}
