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
    Content,
    NeedRecipientSignature: true // запрос на подпись у получающего
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
        ],
        NeedRecipientSignature: true // запрос на подпись у получающего
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

test('postMessagePatch', async () => {
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
  const users = await organizacionClient.getOrganizationUsers(
    myOrganizations['Organizations'][0]['OrgId']
  );
  let userId = 0;
  for (let index = 0; index < users['Users'].length; index++) {
    if (users['Users'][index]['Permissions']['CanSignDocuments']) {
      userId = users['Users'][1]['Id'];
    }
  }
  /* расшифровка ответа на получение сотрудников
    UserDepartmentId - идентификатор подразделения организации, в котором состоит пользователь.
    В случае головного подразделения содержит значение 00000000-0000-0000-0000-000000000000.
    IsAdministrator - может ли пользователь редактировать структуру и реквизиты организации, добавлять и редактировать других пользователей.
    DocumentAccessLevel - уровень доступа к документам
    CanSignDocuments - может ли пользователь подписывать документы.
    CanManageCounteragents - может ли пользователь видеть списки контрагентов и работать с ними.
    CanAddResolutions - может ли пользователь согласовывать документы.
    CanRequestResolutions - может ли пользователь отправлять запросы на согласование и подпись документов.
    SelectedDepartmentIds - список подразделений, к которым имеет доступ пользователь (заполняется только в случае DocumentAccessLevel = SelectedDepartments).
    JobTitle - должность пользователя в организации. Может быть не указана.
    CanCreateDocuments - может ли пользователь создавать и редактировать документы и черновики
    AuthorizationPermission - данные о наличии ограничения доступа пользователя к сервису
    CanDeleteRestoreDocuments - может ли пользователь удалять документы и черновики, восстанавливать документы
  */

  /* варианты передачи документа
    ApprovementRequest - запрос на согласование документа. Подразумевает два возможных действия — Согласовать (ApproveAction) или Отказать в согласовании (DisapproveAction).
    SignatureRequest - запрос на подпись документа. В рамках запроса можно выполнить три действия — Подписать завершающей подписью (SignWithPrimarySignature)/Отказать в подписи контрагенту (RejectSigning) или Отказать в подписи сотруднику (DenySignatureRequest), который запросил подпись.
    ApprovementSignatureRequest - запрос на согласующую подпись под документом. В рамках данного типа запроса можно либо Подписать согласующей подписью (SignWithApprovementSignature), либо Отказать в подписи сотруднику (DenySignatureRequest), который запросил подпись.
  */
  const res = await documentsClient.postMessagePatch(
    myOrganizations['Organizations'][0]['Boxes'][0]['BoxId'],
    getDocuments['Documents'][getDocuments['Documents'].length - 1]['MessageId'],
    getDocuments['Documents'][getDocuments['Documents'].length - 1]['EntityId'],
    userId,
    {
      Type: 'ApprovementRequest'
    }
  );
  console.log(res);
  expect(typeof res === 'object').toStrictEqual(true);
});

test('printDocument', async () => {
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
  const res = await documentsClient.generatePrintForm(
    myOrganizations['Organizations'][0]['Boxes'][0]['BoxId'],
    getDocuments['Documents'][0]['MessageId'],
    getDocuments['Documents'][0]['EntityId']
  );
  console.log(res);
  expect(typeof res === 'object').toStrictEqual(true);
});
