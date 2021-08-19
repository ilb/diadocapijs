import dotenv from 'dotenv';
dotenv.config();
import Authenticate from '../src/Authenticate.js';
import DocumentsClient from '../src/DocumentsClient.js';
import OrganizationsClient from '../src/OrganizationsClient';
import fs from 'fs';
import path from 'path';
import { Buffer } from 'buffer';

test('postDocument', async () => {
  const auth = new Authenticate({
    login: process.env.DIADOC_LOGIN,
    password: process.env.DIADOC_PASSWORD
  });
  const organizacionClient = new OrganizationsClient(auth);
  const myOrganizations = await organizacionClient.getMyOrganizacion();
  const organizationsByInnKpp = await organizacionClient.getOrganizationsByInnKpp(
    '9622992710',
    myOrganizations['Organizations'][0]['Boxes'][0]['BoxId']
  );
  const documentsClient = new DocumentsClient(auth);
  const documentTypes = await documentsClient.getDocumentTypes(
    myOrganizations['Organizations'][0]['Boxes'][0]['BoxId']
  );
  let FileName = path.basename(path.resolve('test/data/testFile.txt').toString());
  let Content = Buffer.from(
    fs.readFileSync(path.resolve('test/data/testFile.txt').toString())
  ).toString('base64');
  const res = await documentsClient.postMessage({
    FromBoxId: myOrganizations['Organizations'][0]['Boxes'][0]['BoxId'],
    ToBoxId: organizationsByInnKpp['Organizations'][0]['Boxes'][0]['BoxId'],
    DelaySend: true,
    TypeNamedId: documentTypes.DocumentTypes[0].Name,
    Value: FileName,
    Content
  });
  console.log(res);
  expect(typeof res === 'object').toStrictEqual(true);
});

test('postDocumentArray', async () => {
  const auth = new Authenticate({
    login: process.env.DIADOC_LOGIN,
    password: process.env.DIADOC_PASSWORD
  });
  const organizacionClient = new OrganizationsClient(auth);
  const myOrganizations = await organizacionClient.getMyOrganizacion();
  const organizationsByInnKpp = await organizacionClient.getOrganizationsByInnKpp(
    '9622992710',
    myOrganizations['Organizations'][0]['Boxes'][0]['BoxId']
  );
  const documentsClient = new DocumentsClient(auth);
  const documentTypes = await documentsClient.getDocumentTypes(
    myOrganizations['Organizations'][0]['Boxes'][0]['BoxId']
  );
  let FileName1 = path.basename(path.resolve('test/data/testFile.txt').toString());
  let Content1 = Buffer.from(
    fs.readFileSync(path.resolve('test/data/testFile.txt').toString())
  ).toString('base64');
  let FileName2 = path.basename(path.resolve('test/data/testFile2.txt').toString());
  let Content2 = Buffer.from(
    fs.readFileSync(path.resolve('test/data/testFile2.txt').toString())
  ).toString('base64');
  const res = await documentsClient.postMessageArray({
    FromBoxId: myOrganizations['Organizations'][0]['Boxes'][0]['BoxId'],
    ToBoxId: organizationsByInnKpp['Organizations'][0]['Boxes'][0]['BoxId'],
    DelaySend: true,
    DocumentAttachments: [
      {
        TypeNamedId: documentTypes.DocumentTypes[0].Name,
        SignedContent: {
          Content: Content1
        },
        Metadata: [
          {
            Key: 'FileName',
            Value: FileName1
          }
        ]
      },
      {
        TypeNamedId: documentTypes.DocumentTypes[0].Name,
        SignedContent: {
          Content: Content2
        },
        Metadata: [
          {
            Key: 'FileName',
            Value: FileName2
          }
        ]
      }
    ]
  });
  console.log(res);
  expect(typeof res === 'object').toStrictEqual(true);
});

test('getDocuments', async () => {
  const auth = new Authenticate({
    login: process.env.DIADOC_LOGIN,
    password: process.env.DIADOC_PASSWORD
  });
  const organizacionClient = new OrganizationsClient(auth);
  const myOrganizations = await organizacionClient.getMyOrganizacion();
  const documentsClient = new DocumentsClient(auth);
  const res = await documentsClient.getDocuments(
    myOrganizations['Organizations'][0]['Boxes'][0]['BoxId'],
    'Outbound' // Inbound - входящее, Outbound - исхрдящее
  );
  console.log(res);
  expect(typeof res === 'object').toStrictEqual(true);
});

test('getDocument', async () => {
  const auth = new Authenticate({
    login: process.env.DIADOC_LOGIN,
    password: process.env.DIADOC_PASSWORD
  });
  const organizacionClient = new OrganizationsClient(auth);
  const myOrganizations = await organizacionClient.getMyOrganizacion();
  const documentsClient = new DocumentsClient(auth);
  const getDocuments = await documentsClient.getDocuments(
    myOrganizations['Organizations'][0]['Boxes'][0]['BoxId'],
    'Outbound' // Inbound - входящее, Outbound - исхрдящее
  );
  const res = await documentsClient.getDocument(
    myOrganizations['Organizations'][0]['Boxes'][0]['BoxId'],
    getDocuments['Documents'][0]['MessageId'],
    getDocuments['Documents'][0]['EntityId'],
    true
  );
  console.log(res);
  expect(typeof res === 'object').toStrictEqual(true);
});

test('GetEntityContent', async () => {
  const auth = new Authenticate({
    login: process.env.DIADOC_LOGIN,
    password: process.env.DIADOC_PASSWORD
  });
  const organizacionClient = new OrganizationsClient(auth);
  const myOrganizations = await organizacionClient.getMyOrganizacion();
  const documentsClient = new DocumentsClient(auth);
  const getDocuments = await documentsClient.getDocuments(
    myOrganizations['Organizations'][0]['Boxes'][0]['BoxId'],
    'Outbound' // Inbound - входящее, Outbound - исхрдящее
  );
  const res = await documentsClient.getEntityContent(
    myOrganizations['Organizations'][0]['Boxes'][0]['BoxId'],
    getDocuments['Documents'][getDocuments['Documents'].length - 1]['MessageId'],
    getDocuments['Documents'][getDocuments['Documents'].length - 1]['EntityId']
  );
  fs.writeFile(
    path
      .resolve(
        'test/data/download/' +
          getDocuments['Documents'][getDocuments['Documents'].length - 1]['FileName']
      )
      .toString(),
    res,
    'binary',
    function (error) {
      if (error) throw error; // если возникла ошибка
    }
  );
  expect(typeof res === 'object').toStrictEqual(true);
});
