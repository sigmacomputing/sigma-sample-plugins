import './style.css';
import { updateDisplay } from './displaySum.js';

document.querySelector('#app').innerHTML = `
  <div>
    <h1>Hello!</h1>
    <div id="card" />
  </div>
`;

updateDisplay(document.querySelector('#card'));
