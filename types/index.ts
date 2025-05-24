export interface IUser {
  fullname: string;
  email: string;
  password: string;
  // role: string;
  userStatus: boolean;
  passwordResetToken?: string;
  passwordResetExpires?: Date | number;
  roleName: string;
}

export interface INews {
  newsTitle: string;
  newsBody: string;
  createdBy: string;
  newsImage: string;
  category: string;
  publish: boolean;
  views: number;
  viewDates?: Date[];
  monthlyViews?: Record<number, Record<number, number>>; // { year: { month: count } }
}

export interface ICategory {
  categoryName: string;
}

export interface IRoles {
  roleName: string;
}
