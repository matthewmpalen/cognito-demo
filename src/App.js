import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import Amplify from 'aws-amplify';

import logo from './logo.svg';
import './App.css';


Amplify.configure({
  Auth: {
    region: 'us-east-1',
    userPoolId: 'us-east-1_dtoahYmZ5',
    userPoolWebClientId: '728pdne1u1trkfn2cb6u1d3h',
  },
});

const App = () => {
  return (
    <div className="App">
      <AmplifySignOut />
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
};

export default withAuthenticator(App);
