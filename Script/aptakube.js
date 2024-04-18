let url = $request.url;
let activate = () => {
  if (url !== 'https://aptakube.com/api/v1/license/validate') return;
  let body = JSON.stringify({
    success: true,
    data: {
      expiry_date: '2035-06-09',
      token: 'aaaaa',
    },
  });
  $done({
    response: {
      body,
    },
  });
};
activate();
