export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
  sessionId?: string;
}

export interface RequestUser {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isDisabled: boolean;
  sessionId?: string;
}