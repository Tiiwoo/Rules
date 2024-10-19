!(async () => {
  ids = $persistentStore.read('APP_ID');
  if (ids == '') {
    $notification.post(
      'All TestFlights have been joined',
      'Module has been automatically disabled',
      ''
    );
    $done($httpAPI('POST', '/v1/modules', { TestFlight: 'false' }));
  } else {
    ids = ids.split(',');
    for await (const ID of ids) {
      await autoPost(ID);
    }
  }
  $done();
})();

function autoPost(ID) {
  let Key = $persistentStore.read('key');
  let testurl = 'https://testflight.apple.com/v3/accounts/' + Key + '/ru/';
  let header = {
    'X-Session-Id': `${$persistentStore.read('session_id')}`,
    'X-Session-Digest': `${$persistentStore.read('session_digest')}`,
    'X-Request-Id': `${$persistentStore.read('request_id')}`,
  };
  return new Promise(function (resolve) {
    $httpClient.get(
      { url: testurl + ID, headers: header },
      function (error, resp, data) {
        if (error === null) {
          if (resp.status == 404) {
            ids = $persistentStore.read('APP_ID').split(',');
            ids = ids.filter((ids) => ids !== ID);
            $persistentStore.write(ids.toString(), 'APP_ID');
            console.log(
              ID +
                ' ' +
                'This TestFlight does not exist, APP_ID has been automatically removed'
            );
            $notification.post(
              ID,
              'This TestFlight does not exist',
              'APP_ID has been automatically removed'
            );
            resolve();
          } else {
            let jsonData = JSON.parse(data);
            if (jsonData.data == null) {
              console.log(ID + ' ' + jsonData.messages[0].message);
              resolve();
            } else if (jsonData.data.status == 'FULL') {
              console.log(ID + ' ' + jsonData.data.message);
              resolve();
            } else {
              $httpClient.post(
                { url: testurl + ID + '/accept', headers: header },
                function (error, resp, body) {
                  let jsonBody = JSON.parse(body);
                  $notification.post(
                    jsonBody.data.name,
                    'TestFlight joined successfully',
                    ''
                  );
                  console.log(
                    jsonBody.data.name + ' TestFlight joined successfully'
                  );
                  ids = $persistentStore.read('APP_ID').split(',');
                  ids = ids.filter((ids) => ids !== ID);
                  $persistentStore.write(ids.toString(), 'APP_ID');
                  resolve();
                }
              );
            }
          }
        } else {
          if (error == 'The request timed out.') {
            resolve();
          } else {
            $notification.post('Automatically join TestFlight', error, '');
            console.log(ID + ' ' + error);
            resolve();
          }
        }
      }
    );
  });
}
