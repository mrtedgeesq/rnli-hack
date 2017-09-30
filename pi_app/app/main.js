import React from 'react'
import ReactDom from 'react-dom'
import App from './src/App'

const container = document.getElementById('container');

ReactDom.render(<App title="Poole Harbour" subtitle=""/>, container);