import './styles/application.scss';

import ReactDOM from 'react-dom';

import midImage from '@/assets/mid.jpeg';
import App from '@/components/App';
import { fetchData, tooltipsInitialization } from '@/javascript/utils';

(function () {
  tooltipsInitialization();
  const img = document.querySelector('[data-target="dynamic-image"]');
  img.src = midImage;

  fetchData().then(data => {
    console.log('response', { ...data, newTitle: `new ${data?.title}` });
  });

  // eslint-disable-next-line react/jsx-filename-extension
  ReactDOM.render(<App />, document.getElementById('app'));
})();
