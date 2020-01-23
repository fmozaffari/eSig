const express = require('express')
var cors = require('cors')
var app = express()

app.use(cors())

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const hellosign = require('hellosign-sdk')({ key: 'f969da3fc2b1fd6a176d9091dd72badae3cc849688ce9f010d19f06852a84022' })

app.get("/", function(req, res) {
    res.send('sig with templating!')
})

let templateId;
/**
 * @createtemplate creates editable template
 * */
app.get("/request", function(req, res) {
    let results;

    //payload to send to hellosign. some of these fields will be populated on the FE. Example, name and files
    const opts = {
    test_mode: 1,
    clientId: '7f6811fc7c7853295c257bb84259c422',
    title: 'embedded draft test',
    subject: 'embedded draft test',
    message: 'embedded draft test',
    signer_roles: [
        {
        name: 'Manager',
        order: 0
        },
        {
        name: 'Employee',
        order: 1
        }
    ],
    files: ['eSignature Product Brief (1).docx']
    };
      

    results = hellosign.template.createEmbeddedDraft(opts)
    .then((resp) => {
        console.log('CREATING TEMPLATE RESPONSE: ',resp)
        //send template_id to database for storage & retrieval
        templateId = resp.template.template_id
        return res.json(resp.template.edit_url)
    }).catch((err) => {
    console.log(err)
    });

    console.log('RESULTS VARIABLE:', results) //{state: 'pending'}
})

/**
 * @previewtemplate user can preview their template and when they click 'continue' it will send an email to the signers to sign the document
 * */
app.get("/preview", function(req, res) {
const opts = {
    test_mode: 1,
    template_id: templateId,
    title: 'embedded draft test',
    subject: 'embedded draft test',
    clientId: '7f6811fc7c7853295c257bb84259c422',
    message: 'hi me! embedded draft test',
    signing_redirect_url: 'http://example.com/signed',
    requesting_redirect_url: 'http://example.com/requested',
    signers: [
      {
        email_address: 'schin@tangibleltd.com', //can change to your email to get the hellosign signature request email
        name: 'Alice',
        role: 'Manager',
        pin: 'abcd1234'
      },
      {
        email_address: 'bob@example.com',
        name: 'Bob',
        role: 'Employee',
        pin: 'abcd1234'
      }
    ],
    requester_email_address: 'charlie@example.com'
  };
  
  hellosign.unclaimedDraft.createEmbeddedWithTemplate(opts).then((resp) => {
    console.log('PREVIEW RESPONSE ', resp)
    return res.json(resp.unclaimed_draft.claim_url)
  }).catch((err) => {
    console.log(err)
  });
})

/**
 * @deletetemplate allows user to delete a request. user must specify the signature_request_id in order to delete on hellosign
 * */
app.delete("/delete", function(req, res) {
    hellosign.signatureRequest.cancel('f2ada5815f4d38534fa38c5115349c3d0022991d')
    .then(function(response){
    console.log(response.statusCode);
    console.log(response.statusMessage);
    });
})

app.listen(5000, () => console.log('we are live on 5000') )