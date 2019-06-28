import './styles/application.scss';
import 'bootstrap';
import $ from 'jquery';
import midImage from '@/assets/mid.jpeg';

$(function() {
  $('[data-toggle="tooltip"]').tooltip();

  const img = document.querySelector('[data-target="dynamic-image"]');
  img.src = midImage;

  fetchData();
});

async function fetchData() {
  const response = await fetch('https://jsonplaceholder.typicode.com/todos/1');
  const data = await response.json();
  console.log('response', data);
}
