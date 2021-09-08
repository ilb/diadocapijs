import fetch from 'isomorphic-fetch';

export default class Authenticate {
  constructor({ login, password }) {
    this.login = login;
    this.password = password;
  }
 
  async auth() {
    const url = 'https://diadoc-api.kontur.ru/V3/Authenticate?type=password';
    const login = this.login;
    const password = this.password;
    const data = { login, password };
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'DiadocAuth ddauth_api_client_id=' + process.env.API_CLIENT_ID
      },
      body: JSON.stringify(data)
    };
    const response = await fetch(url, options);
    if (!response.ok) {
      const text = await response.text();
      throw new Error(text);
    }
    this.token = await response.text();
  }

  getToken() {
    return this.token;
  }
}
