import React from 'react';
import ReactDOM from 'react-dom';
import HystrixDashboard from './components/hystrix-dashboard';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<HystrixDashboard />, document.getElementById('root'));
registerServiceWorker();
