export interface IUser {
  fullname: string;
  email: string;
  password: string;
  role: string;
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
