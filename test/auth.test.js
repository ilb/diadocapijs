import Authenticate from '../src/Authenticate.js';

test('authenticate', async () => {
  const auth = new Authenticate({
    login: 'small.ball.92@gmail.com',
    password: 'LiLi11211992'
  });
  await auth.auth();
  console.log(auth.getToken());
  expect(auth.getToken().length > 10).toStrictEqual(true);
});
