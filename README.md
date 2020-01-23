# eSig

## There is a simple express app that makes calls to HelloSign and a simple react app that provides the interaction.

To start the express server, n the project root directory, you can run:
### `npm install`
### `npm dev`

To start the React app, in the ReactApp directory, you can run:
### `npm install`
### `npm start`

Clicking on "send signature request" button sends a request without a problem .<br />
When I add the Document array (server.js : 41) to my options in order to use the form_fields the call fails. You can see the error in the express terminal.
