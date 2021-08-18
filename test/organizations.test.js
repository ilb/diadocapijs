import dotenv from 'dotenv';
dotenv.config();
import Authenticate from '../src/Authenticate.js';
import OrganizationsClient from '../src/OrganizationsClient.js';

test('GetMyOrganizacion', async () => {
  const auth = new Authenticate({
    login: process.env.DIADOC_LOGIN,
    password: process.env.DIADOC_PASSWORD
  });
  const organizacion = new OrganizationsClient(auth);
  const res = await organizacion.getMyOrganizacion();
  console.log(res);
  expect(typeof res === 'object').toStrictEqual(true);
});

test('GetOrganizationsByInnKpp - accept', async () => {
  const auth = new Authenticate({
    login: process.env.DIADOC_LOGIN,
    password: process.env.DIADOC_PASSWORD
  });
  const organizacion = new OrganizationsClient(auth);
  const myOrganizations = await organizacion.getMyOrganizacion();
  const res = await organizacion.getOrganizationsByInnKpp(
    '9622992710',
    myOrganizations['Organizations'][0]['Boxes'][0]['BoxId']
  );
  console.log(res);
  expect(typeof res === 'object').toStrictEqual(true);
});

test('GetOrganizationsByInnKpp - error', async () => {
  const auth = new Authenticate({
    login: process.env.DIADOC_LOGIN,
    password: process.env.DIADOC_PASSWORD
  });
  const organizacion = new OrganizationsClient(auth);
  const myOrganizations = await organizacion.getMyOrganizacion();
  const res = await organizacion.getOrganizationsByInnKpp(
    '12341234',
    myOrganizations['Organizations'][0]['Boxes'][0]['BoxId']
  );
  console.log(res);
  expect(typeof res === 'object').toStrictEqual(true);
});
