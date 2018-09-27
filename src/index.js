import './styles/application.scss';
import 'bootstrap';
import $ from 'jquery';
import '@babel/polyfill';

$(function() {
  $('[data-toggle="tooltip"]').tooltip();

  fetchData();
  async function fetchData() {
    const response = await fetch(
      'https://jsonplaceholder.typicode.com/todos/1'
    );
    const data = await response.json();
    console.log('response', data);
  }
});
