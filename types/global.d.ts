export {}

// Create a type for the Roles
export type Roles = 'author' | 'user' | 'super-admin'

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      roles?: Roles[]
    }
  }
}
