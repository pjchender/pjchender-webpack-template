import './styles/application.scss';
import 'bootstrap';
import $ from 'jquery';
import midImage from '@/assets/mid.jpeg';
import { fetchData } from '@/javascript/utils';

$(function () {
  $('[data-toggle="tooltip"]').tooltip();

  const img = document.querySelector('[data-target="dynamic-image"]');
  img.src = midImage;

  fetchData().then((data) => {
    console.log('response', data);
  });
});
