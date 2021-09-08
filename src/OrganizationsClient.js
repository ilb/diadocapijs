import fetch from 'isomorphic-fetch';

export default class OrganizationsClient {
  constructor(authenticate) {
    this.authenticate = authenticate;
  }

  async getMyOrganizacion() {
    const url = 'https://diadoc-api.kontur.ru/GetMyOrganizations?autoRegister=true';
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization:
          'DiadocAuth ddauth_api_client_id=' +
          process.env.API_CLIENT_ID +
          ',ddauth_token=' +
          this.authenticate.getToken()
      }
    };
    const response = await fetch(url, options);
    if (!response.ok) {
      if (response.status == 401) {
        await this.authenticate.auth();
        return this.getMyOrganizacion();
      } else {
        const text = await response.text();
        throw new Error(text);
      }
    }
    const text = await response.json();
    //console.log(text['Organizations'][0]['Boxes'][0]['BoxId']);
    return text;
  }

  async getOrganizationsByInnKpp(inn, boxId) {
    const url =
      'https://diadoc-api.kontur.ru/GetOrganizationsByInnKpp?inn=' + inn + '&boxId=' + boxId;
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization:
          'DiadocAuth ddauth_api_client_id=' +
          process.env.API_CLIENT_ID +
          ',ddauth_token=' +
          this.authenticate.getToken()
      }
    };
    const response = await fetch(url, options);
    if (!response.ok) {
      if (response.status == 401) {
        await this.authenticate.auth();
        return this.getOrganizationsByInnKpp(inn, boxId);
      } else {
        const text = await response.text();
        throw new Error(text);
      }
    }
    const text = await response.json();
    if (text['Organizations'].length > 0) {
      return text;
    } else {
      return { error: 'Организация не найдена.' };
    }
  }
}
