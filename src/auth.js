import fetch from 'isomorphic-fetch';

export async function authenticate({ login, password }) {
  const url = 'https://diadoc-api.kontur.ru/V3/Authenticate?type=password';
  const data = { login, password };
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'DiadocAuth ddauth_api_client_id=auto-XXXXXXXXXXX-XXXX-XXXX-XXXXXXX'
    },
    body: JSON.stringify(data)
  };
  const response = await fetch(url, options);
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text);
  }
  const text = await response.text();
  console.log(text);
  return text;
}
