import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string;
      surname?: string;
      email?: string;
      phoneNumber?: string;
    };
  }

  interface User {
    id: string;
    name?: string;
    surname?: string;
    email?: string;
    phoneNumber?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    name?: string;
    surname?: string;
    email?: string;
    phoneNumber?: string;
  }
}
