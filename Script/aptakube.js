let url = $request.url;

let activate = () => {
  if (url !== 'https://aptakube.com/api/v1/license/validate') return;
  let body = JSON.stringify({
    license_key: 'V2HRZ-L0EP9-XWWZ2-1BI4O-5G1VZ-K1ZRE',
    token:
      'eyJhbGciOiJIUzUxMiJ9.eyJleHBpcnlfZGF0ZSI6IjIwMzctMTItMzFUMjM6NTk6NTkuMDAwWiIsImxpY2Vuc2Vfa2V5IjoiVjJIUlotTDBFUDktWFdXWjItMUJJNE8tNUcxVlotSzFaUkUiLCJpYXQiOjE3MjQ5MjU0MDgsImlzcyI6ImFwdGFrdWJlLWNvbSIsImV4cCI6MTcyNTA5ODIwOH0.LAaakMym4jYZedLhVUQ25vI_dx4TvSwNLitT2lAS_Ia5HbawTHuGK964rfQlveto_JAVur_ZlQL2GScG3cW3AA',
    expiry_date: '2037-12-31T23:59:59.000Z',
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

let noticeHijack = () => {
  if (url !== 'https://aptakube.com/api/v1/license/notice') return;
  let body = JSON.stringify({
    msg: 'OK',
  });
  $done({
    response: {
      body,
    },
  });
};

activate();
eventHijack();
noticeHijack();
