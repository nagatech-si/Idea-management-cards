export interface User {
  id: string;
  email: string;
  nama: string;
  password: string;
}

export const UserDummy: User = {
    id: "user123",
    email: "corsec@gmail.com",
    nama: "Corsec User",
    password: "b3r4sput1h"
}