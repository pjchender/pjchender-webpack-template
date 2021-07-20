import './styles/application.scss';

import midImage from '@/assets/mid.jpeg';
import { fetchData, tooltipsInitialization } from '@/javascript/utils';

(function () {
  tooltipsInitialization();
  const img = document.querySelector('[data-target="dynamic-image"]');
  img.src = midImage;

  fetchData().then((data) => {
    const { userId, id, title } = data;
    console.log('response', { ...data, newTitle: `new ${data?.title}` });
  });
})();
