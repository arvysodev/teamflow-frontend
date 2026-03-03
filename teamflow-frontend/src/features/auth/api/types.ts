export type LoginRequest = {
  email: string
  password: string
}

export type LoginResponse = {
  accessToken: string
}

export type RegisterRequest = {
  username: string
  email: string
  password: string
}

export type RegisterResponse = {}

export type VerifyEmailRequest = {
  token: string
}
