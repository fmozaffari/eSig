const express = require('express')
var cors = require('cors')
var app = express()

app.use(cors())

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const hellosign = require('hellosign-sdk')({ key: 'f969da3fc2b1fd6a176d9091dd72badae3cc849688ce9f010d19f06852a84022' })

app.get("/", function(req, res) {
    res.send('yiii!')
})

app.get("/request", function(req, res) {
    const opts = {
        test_mode: 1,
        clientId: '7f6811fc7c7853295c257bb84259c422',
        title : 'NDA with Acme Co.',
        subject: 'The NDA we talked about',
        message: 'Please sign this NDA and then we can discuss more.',
        signers: [
          {
            email_address: 'schin@tangibleltd.com',
            name: 'me!'
          }
        ],
        files: ['eSignature Product Brief (1).docx'],
        // is_for_embedded_signing: 1
      };

    hellosign.signatureRequest.createEmbedded(opts)
    .then(function(resp){
        // console.log(resp.signature_request)//, res.signature_request.signatures[0].signature_id);
        resp.signature_request
        hellosign.embedded.getSignUrl(resp.signature_request.signatures[0].signature_id)
        .then(data => {
            console.log(data.embedded.sign_url)
            return res.json(data.embedded.sign_url)
        });
    })

// hellosign.signatureRequest.createEmbedded(opts).then((res) => {
//     const signature = res.signature_request.signatures[0];
//     const signatureId = signature.signature_id;
//     res.send(signatureId)  
//     return hellosign.embedded.getSignUrl(signatureId);
//   }).then((res) => {
//     res.json({signUrl: res.embedded.sign_url})
//     res.writeHead(statusCode, res.embedded.sign_url)
//     console.log('The sign url: ' + res.embedded.sign_url);
//   }).catch((err) => {
//     // handle error
//   });
})

app.delete("/delete", function(req, res) {
    hellosign.signatureRequest.cancel('f2ada5815f4d38534fa38c5115349c3d0022991d') //signature_request_id
    .then(function(response){
    console.log(response.statusCode);
    console.log(response.statusMessage);
    });
})

app.listen(5000, () => console.log('we are live on 5000') )