import fetch from 'isomorphic-fetch';

export async function send(authToken, { FromBoxId, ToBoxId, DelaySend }) {
  const url = 'https://diadoc-api.kontur.ru/V3/PostMessage';
  const data = { FromBoxId, ToBoxId, DelaySend };
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
  return '';
}
