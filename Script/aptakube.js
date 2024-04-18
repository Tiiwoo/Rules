let url = $request.url;
let activate = () => {
  if (url !== 'https://aptakube.com/api/v1/license/validate') return;
  let body = JSON.stringify({
    success: true,
    response: {
      expiry_date: '2035-06-09T23:59:59.000Z',
      token:
        'eyJhbGciOiJIUzUxMiJ9eyJleHBpcnlfZGF0ZSI6IjIwMjMtMDktMjBUMjM6NTk6NTkuMDAwWiIsImlhdCI6MTY5MjY4ODU2MywiaXNzIjoiYXB0YWt1YmUtY29tIiwiZXhwIjoxNzkyOTk4NTYzfQ==',
    },
  });
  $done({
    response: {
      body,
    },
  });
};
activate();
