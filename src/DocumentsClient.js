import fetch from 'isomorphic-fetch';
import Timeout from 'await-timeout';

export default class DocumentsClient {
  constructor(authenticate) {
    this.authenticate = authenticate;
  }

  async postMessagePatch(BoxId, MessageId, InitialDocumentId, TargetUserId, { Type }) {
    const url = 'https://diadoc-api.kontur.ru/V3/PostMessagePatch';
    const data = {
      BoxId: BoxId,
      MessageId: MessageId,
      ResolutionRequests: [
        {
          InitialDocumentId: InitialDocumentId,
          Type,
          TargetUserId: TargetUserId
        }
      ]
    };
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization:
          'DiadocAuth ddauth_api_client_id=' +
          this.authenticate.apiClientId +
          ',ddauth_token=' +
          this.authenticate.getToken()
      },
      body: JSON.stringify(data)
    };
    const response = await fetch(url, options);
    if (!response.ok) {
      if (response.status === 401) {
        await this.authenticate.auth();
        return await this.postMessagePatch(BoxId, MessageId, InitialDocumentId, TargetUserId);
      } else {
        const text = await response.text();
        throw new Error(text);
      }
    }
    return await response.json();
  }

  async postMessage({
    FromBoxId,
    ToBoxId,
    DelaySend,
    TypeNamedId,
    Content,
    Value,
    NeedRecipientSignature
  }) {
    const url = 'https://diadoc-api.kontur.ru/V3/PostMessage';
    const data = {
      FromBoxId,
      ToBoxId,
      DocumentAttachments: [
        {
          TypeNamedId,
          SignedContent: {
            Content
          },
          Metadata: [
            {
              Key: 'FileName',
              Value
            }
          ],
          NeedRecipientSignature
        }
      ],
      DelaySend
    };
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization:
          'DiadocAuth ddauth_api_client_id=' +
          this.authenticate.apiClientId +
          ',ddauth_token=' +
          this.authenticate.getToken()
      },
      body: JSON.stringify(data)
    };
    const response = await fetch(url, options);
    if (!response.ok) {
      if (response.status === 401) {
        await this.authenticate.auth();
        return await this.postMessage({
          FromBoxId,
          ToBoxId,
          DelaySend,
          TypeNamedId,
          Content,
          Value
        });
      } else {
        const text = await response.text();
        throw new Error(text);
      }
    }
    return await response.json();
  }

  async postMessageArray({ FromBoxId, ToBoxId, DelaySend, DocumentAttachments }) {
    const url = 'https://diadoc-api.kontur.ru/V3/PostMessage';
    const data = {
      FromBoxId,
      ToBoxId,
      DocumentAttachments,
      DelaySend
    };
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization:
          'DiadocAuth ddauth_api_client_id=' +
          this.authenticate.apiClientId +
          ',ddauth_token=' +
          this.authenticate.getToken()
      },
      body: JSON.stringify(data)
    };
    const response = await fetch(url, options);
    if (!response.ok) {
      if (response.status === 401) {
        await this.authenticate.auth();
        return await this.postMessage({ FromBoxId, ToBoxId, DelaySend, DocumentAttachments });
      } else {
        const text = await response.text();
        throw new Error(text);
      }
    }
    return await response.json();
  }

  async getDocuments(boxId, Outbound) {
    const url =
      'https://diadoc-api.kontur.ru/V3/GetDocuments?boxId=' +
      boxId +
      '&filterCategory=Any.' +
      Outbound;

    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization:
          'DiadocAuth ddauth_api_client_id=' +
          this.authenticate.apiClientId +
          ',ddauth_token=' +
          this.authenticate.getToken()
      }
    };
    const response = await fetch(url, options);
    if (!response.ok) {
      if (response.status === 401) {
        await this.authenticate.auth();
        return await this.getDocuments(boxId, Outbound);
      } else {
        const text = await response.text();
        throw new Error(text);
      }
    }
    return await response.json();
  }

  async getDocument(boxId, messageId, entityId, injectEntityContent) {
    const url =
      'https://diadoc-api.kontur.ru/V3/GetDocument?boxId=' +
      boxId +
      '&messageId=' +
      messageId +
      '&entityId=' +
      entityId +
      '&injectEntityContent=' +
      injectEntityContent;
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization:
          'DiadocAuth ddauth_api_client_id=' +
          this.authenticate.apiClientId +
          ',ddauth_token=' +
          this.authenticate.getToken()
      }
    };
    const response = await fetch(url, options);
    if (!response.ok) {
      if (response.status === 401) {
        await this.authenticate.auth();
        return await this.getDocument(boxId, messageId, entityId, injectEntityContent);
      } else {
        const text = await response.text();
        throw new Error(text);
      }
    }
    return await response.json();
  }

  async getEntityContent(boxId, messageId, entityId) {
    const url =
      'https://diadoc-api.kontur.ru/V4/GetEntityContent?boxId=' +
      boxId +
      '&messageId=' +
      messageId +
      '&entityId=' +
      entityId;
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          'DiadocAuth ddauth_api_client_id=' +
          this.authenticate.apiClientId +
          ',ddauth_token=' +
          this.authenticate.getToken()
      }
    };
    const response = await fetch(url, options);
    if (!response.ok) {
      if (response.status === 401) {
        await this.authenticate.auth();
        return await this.getEntityContent(boxId, messageId, entityId);
      } else {
        const text = await response.text();
        throw new Error(text);
      }
    }
    return await response.buffer();
  }

  async getDocumentTypes(boxId) {
    const url = 'https://diadoc-api.kontur.ru/V2/GetDocumentTypes?boxId=' + boxId;

    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization:
          'DiadocAuth ddauth_api_client_id=' +
          this.authenticate.apiClientId +
          ',ddauth_token=' +
          this.authenticate.getToken()
      }
    };
    const response = await fetch(url, options);
    if (!response.ok) {
      if (response.status === 401) {
        await this.authenticate.auth();
        return await this.getDocumentTypes(boxId);
      } else {
        const text = await response.text();
        throw new Error(text);
      }
    }
    return await response.json();
  }

  async generatePrintForm(boxId, messageId, documentId) {
    const url =
      'https://diadoc-api.kontur.ru/GeneratePrintForm?boxId=' +
      boxId +
      '&messageId=' +
      messageId +
      '&documentId=' +
      documentId;

    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization:
          'DiadocAuth ddauth_api_client_id=' +
          this.authenticate.apiClientId +
          ',ddauth_token=' +
          this.authenticate.getToken()
      }
    };
    let result;
    const response = await fetch(url, options);
    if (!response.ok) {
      if (response.status === 401) {
        await this.authenticate.auth();
        return await this.generatePrintForm(boxId, messageId, documentId);
      } else {
        const text = await response.text();
        throw new Error(text);
      }
    }
    const headers = await response.headers;
    // const dontRetry = headers.get('dont-retry');
    // const retryAfter = headers.get('retry-after');
    // const xKonturDontRetry = headers.get('x-kontur-dont-retry');

    // console.log({ response, headers, dontRetry, retryAfter, xKonturDontRetry });
    if (headers.get('retry-after')) {
      const retry = Number(headers.get('retry-after'));
      await Timeout.set(retry * 1000);
      return await this.generatePrintForm(boxId, messageId, documentId);
    } else {
      const doc_name = headers.get('content-disposition').split(';')[1].split('=')[1].slice(1, -1);
      const text = await response.buffer();
      result = {
        filename: doc_name,
        filecontent: text
      };
    }
    return result;
  }
}
