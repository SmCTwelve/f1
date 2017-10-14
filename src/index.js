import React from 'react';
import ReactDOM from 'react-dom';
import Test from './test.js';

console.log("Index file loaded.");
console.log("Something else");
Test();

if (module.hot) {
  module.hot.accept();
}

