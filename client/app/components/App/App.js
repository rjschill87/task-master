import React, { Component } from 'react';

const App = ({ children }) => (
  <div className="tm-c-taskmaster-wrapper">
    <main>
      {children}
    </main>
  </div>
);

export default App;
