/* 
Usage:
[Script]
Paddle_Verify = type=http-request,pattern=^https://v3.paddleapi.com/3.2/license/verify,requires-body=1,max-size=0,debug=1,script-path=paddle_act.js
Paddle_Activate = type=http-request,pattern=^https://v3.paddleapi.com/3.2/license/activate,requires-body=1,max-size=0,debug=1,script-path=paddle_act.js
*/

let url = $request.url;

let paddleActivate = () => {
  if (url !== 'https://v3.paddleapi.com/3.2/license/activate') return;
  let body = $request.body.split('&');
  let product_id = '';
  for (let k of body) {
    if (k.indexOf('product_id') != -1) {
      product_id = k.split('=')[1];
    }
  }

  $done({
    response: {
      body: JSON.stringify({
        success: true,
        response: {
          product_id: product_id,
          activation_id: '@tiiwoo',
          type: 'personal',
          expires: 1,
          expiry_date: 1999999999999,
        },
      }),
    },
  });
};

let paddleVerify = () => {
  if (url !== 'https://v3.paddleapi.com/3.2/license/verify') return;
  let body = JSON.stringify({
    success: true,
    response: {
      type: 'personal',
      expires: 1,
      expiry_date: 1999999999999,
    },
  });
  $done({
    response: {
      body,
    },
  });
};

paddleActivate();
paddleVerify();
