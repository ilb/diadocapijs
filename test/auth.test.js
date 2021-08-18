import dotenv from 'dotenv';
dotenv.config();
import Authenticate from '../src/Authenticate.js';

test('authenticate', async () => {
  const auth = new Authenticate({
    login: process.env.DIADOC_LOGIN,
    password: process.env.DIADOC_PASSWORD
  });
  await auth.auth();
  console.log(auth.getToken());
  expect(auth.getToken().length > 10).toStrictEqual(true);
});
