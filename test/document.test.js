import { authenticate } from '../src/auth.js';
import { send } from '../src/document.js';

test('document', async () => {
  const authToken = await authenticate({ login: 'user@domain', password: '' });
  const res = await send(authToken, {
    FromBoxId: '2BM-9658074209-965801000-202107160733171263174',
    ToBoxId: '2BM-9630623554-963001000-202107200705341151536',
    DelaySend: true
  });
  expect(res).toStrictEqual('');
});
