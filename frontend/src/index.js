import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
 
import axios from 'axios';
const root = ReactDOM.createRoot(document.getElementById('root'));
axios.defaults.baseURL='https://api.donatecard.co.in'
// axios.defaults.baseURL='http://localhost:5000'





// 🔐 Request interceptor
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // 👈 yahin se utha raha hai

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);






root.render(
  <React.StrictMode>
{/* <GoogleOAuthProvider clientId="319113493319-f4638vr2ent4e4tm1evgkso1s31u1uc8.apps.googleusercontent.com"> */}
  <App />
{/* </GoogleOAuthProvider> */}
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
