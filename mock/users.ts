// database product seed
const dbUser = process.env.DATABASE_USER;
const dbPassword = process.env.DATABASE_PASSWORD;

type MockUser = {
  email: string;
  firstName?: string;
  password?: string;
};

// const mockUsers = [
const mockUsers: MockUser[] = [
  {
    email: 'alice1@mms.io',
    firstName: 'Alice',
    password: 'changeMe',
  },
  {
    email: 'bob1@mms.io',
    firstName: 'Bob',
  },
  {
    email: dbUser,
    password: dbPassword,
  },
];

export default mockUsers;
