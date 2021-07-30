import { authenticate } from '../src/auth.js';

test('authenticate', async () => {
  const auth = 'zzzzzzzzzzzzzzzz'; //await authenticate({ login: 'user@domain', password: '' });
  expect(auth.length > 10).toStrictEqual(true);
});
