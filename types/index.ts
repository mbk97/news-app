export interface IUser {
  fullname: string;
  email: string;
  password: string;
  role: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date | number;
}

export interface INews {
  newsTitle: string;
  newsBody: string;
  createdBy: string;
  newsImage: string;
  category: string;
  publish: boolean;
  views: number;
}

export interface ICategory {
  categoryName: string;
}
