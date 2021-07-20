import { useCallback, useEffect, useState } from 'react';

import WebpackLogo from '@/assets/webpack-logo.svg';
import { fetchData } from '@/javascript/utils';

const title = 'React with Webpack and Babel';

const App = () => {
  const [todo, setTodo] = useState([]);
  const printMe = useCallback(() => {
    console.log('use react with webpack + babel');
  }, []);

  useEffect(() => {
    fetchData().then(data => {
      setTodo(data);
    });
  }, []);

  return (
    <div>
      <h1 className="hello">{title}</h1>
      <img src={WebpackLogo} alt="webpack-logo" />
      <p>todo: {todo.title}</p>
      <button type="button" onClick={() => printMe()}>
        Click Me
      </button>
    </div>
  );
};

export default App;
