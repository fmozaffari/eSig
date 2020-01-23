import React, {useState, useEffect} from 'react';
import logo from './logo.svg';
import './App.css';
import HelloSign from 'hellosign-embedded';

function App() {
const [signUrl, setEditURL ] = useState()

useEffect(()=>{
  if(signUrl){
    const client = new HelloSign({
      clientId: '7f6811fc7c7853295c257bb84259c422',
    });
    client.open(signUrl, {
      testMode: true
    });
  }
}, [signUrl])

const fecthData = () => {
  const response = fetch(`http://localhost:5000/request`)
  .then(res=>{
    return res.json()
  }).then(data =>{
    console.log(data)
    setEditURL(data)
  })
}

const deleteRequest = async() => {
  const response = await fetch(new Request(`http://localhost:5000/delete`, {
    method: "DELETE",
  }));
  console.log(response)
}

const getPreview = () => {
  fetch(`http://localhost:5000/preview`)
  .then(res=>{
    console.log(res)
    return res.json()
  }).then(data =>{
    console.log(data)
    setEditURL(data)
  })
}

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <button onClick={fecthData}>Send signature request</button>
        <button onClick={getPreview}>Get preview request</button>
        <button onClick={deleteRequest}>Delete signature request</button>
      </header>
    </div>
  );
}

export default App;
