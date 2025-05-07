export interface RequestRegister {
  name: string | undefined;
  username: string;
  email: string;
  password: string;
}
export interface RequestLogin {
  usernameOrEmail: string;
  password: string;
}

export interface RequestDelete {
  password: string;
}
