export {}

// Create a type for the Roles
export type Roles = 'admin' | 'editor' | 'super-admin'

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      roles?: Roles[]
    }
  }
}
