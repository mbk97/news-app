export interface IUser {
  fullname: string;
  email: string;
  password: string;
  role: string;
  passwordResetToken?: string;
  passwordResetExpires?: any;
}

export interface INews {
  newsTitle: string;
  newsBody: string;
  createdBy: string;
  newsImage: string;
  category: string;
}

export interface ICategory {
  categoryName: string;
}
