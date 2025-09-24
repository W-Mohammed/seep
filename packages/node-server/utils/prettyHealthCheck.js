const prettyHealthCheck = (response) => {
  const html = `<html>
    <head>
    <title>Dark Peak Analytics SEE Platform health check</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        * { font-family: monospace; background-color: #202020; color: white; font-size: 14px; }
      .container { display: flex; flex-direction: column; align-items: start; margin: 20px; }
      h1 { font-size: 18px; }
      .circle { height: 14px; width: 14px; border-radius: 50%; display: inline-block; margin-right: 10px; }
      .green { background-color: green; }
      .red { background-color: red; }
      .flexi { display: flex; flex-direction: row; align-items: center; width: 100%; margin-bottom: 4px; }
      .service-tag { margin-left: 5px; margin-right: 10px; }
        .error { color: red; margin-left: 10px; max-width: 300px; }
      </style></head>
      <body>
      <div class="container">
      <h1>Dark Peak Analytics SEE Platform health check</h1>
      
      <div class="flexi">
      <div class="circle ${response.node === 'OK' ? 'green' : 'red'}"></div>
      <div class="service-tag">Node</div>
      </div>

      <div class="flexi">
      <div class="circle ${response.mongo.status === 'OK' ? 'green' : 'red'}"></div> 
      <div class="service-tag">Mongo</div>
      (${response.mongo.delay})
      
      </div>

      <div class="flexi">
      <div class="circle ${response.r.status === 'OK' ? 'green' : 'red'}"></div> 
      <div class="service-tag">R</div>
      (${response.r.delay}) 

      </div>

      <div class="flexi">
      <div class="circle ${response.webapp.status === 'OK' ? 'green' : 'red'}"></div>
      <div class="service-tag">Webapp</div>
      (${response.webapp.delay})
      </div>
      </div>
      </body></html>`;
  return html;
};

module.exports = { prettyHealthCheck };
