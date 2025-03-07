export interface RegisterData {
  name: string;
  email: string;
  password: string;
  rePassword: string;
  dateOfBirth: string;
  gender: string;
}

export interface loginData {
  email: string;
  password: string;
}

export interface changePasswordData {
  password: string;
  rePassword: string;
}
