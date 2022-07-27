import './App.css';
import {
  client,
  useVariable,
} from "@sigmacomputing/plugin";
import * as React from "react";

client.config.configureEditorPanel([
  { name: 'Quarter', type: 'variable' },
  { name: 'Search SKU Number', type: 'variable' },
  { name: 'Order Number', type: 'variable' },
  { name: 'Customer ID', type: 'variable' },
]);

function App() {
  const [, setQuarter] = useVariable('Quarter');
  const [, setSearchSKU] = useVariable('Search SKU Number');
  const [, setOrderNumber] = useVariable('Order Number');
  const [, setCustomerID] = useVariable('Customer ID');

  return <>
  <label>Select Quarter</label>
  <br></br>

  <select name='quarter' id='quarter' onChange={updateQuarter}>
    <option value='1'>Quarter 1</option>
    <option value='2'>Quarter 2</option>
    <option value='3'>Quarter 3</option>
    <option value='4'>Quarter 4</option>
    <option value='Reset'>No Selection</option>
  </select>

  <br></br>
  <br></br>
  <label>Search SKU Number: </label>
  <input type='text' name='test' id='skunumber'></input>
  <input type='button' name='searchsku' id='searchsku' value='Search' onClick={() => filterSKU(document.getElementById('skunumber')?.value)}></input>

  <br></br>
  <br></br>

  <label>CustomerID</label>
  <input type='text' name='test2' id='custid'></input>

  <label>Minimum Order Number</label>
  <input type='text' name='test3' id='ordernumbermin'></input>

  <label>Maximum Order Number</label>
  <input type='text' name='test4' id='ordernumbermax'></input>

  <input type='button' name='multi' id='multi' value='Mutate Customer ID and Order Number' onClick={() => setAllThree(document.getElementById('custid')?.value, document.getElementById('ordernumbermin')?.value, document.getElementById('ordernumbermax')?.value)}></input>
  </>;

function updateQuarter(value) {
  switch (value.target.value) {
    case '1':
      setQuarter(false, '2022-04-30');
      break;
    case '2':
      setQuarter('2022-05-01', '2022-07-31');
      break;
    case '3':
      setQuarter('2022-08-01', '2022-10-31');
      break;
    case '4':
      setQuarter('2022-11-01', '2023-01-31');
      break;
    default:
      setQuarter('', '');
    }
  }
  function filterSKU(input) {
    setSearchSKU(input);
  }
function setAllThree(custID, orderNumberMin, orderNumberMax) {
  setCustomerID(custID);
  setOrderNumber(orderNumberMin, orderNumberMax);
  }
}

  export default App;
