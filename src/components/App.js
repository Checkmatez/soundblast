import React from 'react';

import Header from './Header';
import FooterPlayer from './FooterPlayer';

const App = ({ children }) => (
  <div>
    <Header />
    {children}
    <FooterPlayer />
  </div>
);

export default App;
