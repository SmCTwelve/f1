import React from 'react';
import ReactDOM from 'react-dom';
import Test from './test.js';
import './styles/main.scss';

console.log("Index file loaded.");
Test();

if (module.hot) {
  module.hot.accept();
}

