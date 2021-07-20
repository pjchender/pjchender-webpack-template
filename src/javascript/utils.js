import { Tooltip } from 'bootstrap';

export const fetchData = async () => {
  const response = await fetch('https://jsonplaceholder.typicode.com/todos/1');
  const data = await response.json();
  return data;
};

export const tooltipsInitialization = () => {
  const tooltipTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="tooltip"]')
  );

  tooltipTriggerList.map((tooltipTriggerEl) => new Tooltip(tooltipTriggerEl));
};
