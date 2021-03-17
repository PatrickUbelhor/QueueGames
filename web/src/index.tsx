import './index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { store } from './state/Store';
import App from './App';

ReactDOM.render(
	// <React.StrictMode>
	//   <App />
	// </React.StrictMode>,

	<Provider store={store}>
		<App/>
	</Provider>,
	document.getElementById('root')
);
