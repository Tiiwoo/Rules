let url = $request.url;

let activate = () => {
  if (url !== 'https://aptakube.com/api/v1/license/validate') return;
  let body = JSON.stringify({
    // license_key: 'V2PCP-W8OSZ-BTM2Y-C5X42-RAKW0-XUEHU',
    license_key: 'XXXXX-XXXXX-XXXXX-XXXXX-XXXXX-XXXXX',
    token:
      // 'eyJhbGciOiJIUzUxMiJ9.eyJleHBpcnlfZGF0ZSI6IjIwMzctMTItMzFUMjM6NTk6NTkuMDAwWiIsImxpY2Vuc2Vfa2V5IjoiVjJQQ1AtVzhPU1otQlRNMlktQzVYNDItUkFLVzAtWFVFSFUiLCJpYXQiOjE3MTM0NTU5NjgsImlzcyI6ImFwdGFrdWJlLWNvbSIsImV4cCI6MTcxMzYyODc2OH0.8St_GD9zNLuBPIhQbuQOrR73Npe2Fc_t9hjzhWSsuZE4waoyPjvg-C1fLxZYFxa1TDwdcUVny2lFHvq23LEEbg',
      'eyJhbGciOiJIUzUxMiJ9.eyJleHBpcnlfZGF0ZSI6IjIwMzctMTItMzFUMjM6NTk6NTkuMDAwWiIsImxpY2Vuc2Vfa2V5IjoiVjJQQ1AtVzhPU1otQlRNMlktQzVYNDItUkFLVzAtWFVFSFUiLCJpYXQiOjE3MTM0NTU5NjgsImlzcyI6ImFwdGFrdWJlLWNvbSIsImV4cCI6MTcxMzYyODc2OH0.8St_GD9zNLuBPIhQbuQOrR73Npe2Fc_t9hjzhWSsuZE4waoyPjvg-C1fLxZYFxa1TDwdcUVny2lFHvq23abcde',
    expiry_date: '2099-12-31T23:59:59.000Z',
  });
  $done({
    response: {
      body,
    },
  });
};

let eventHijack = () => {
  if (url !== 'https://eu.aptabase.com/api/v0/events') return;
  // return empty body
  let body = JSON.stringify({});
  $done({
    response: {
      body,
    },
  });
};

activate();
eventHijack();
