import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';

import configureStore from './store/configureStore';
import App from './components/App';
import SongDetails from './components/SongDetails';
import UserDetails from './components/UserDetails';
import SongList from './components/SongList';
import CategoriesPicker from './components/CategoriesPicker';
import injectCSSReset from './utils/cssReset';

injectCSSReset();

const store = configureStore();

render(
  <Provider store={store}>
    <Router history={hashHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={CategoriesPicker} />
        <Route path="/songs/:songId" component={SongDetails} />
        <Route path="/users/:userId" component={UserDetails} />
        <Route path="/:categories" component={SongList} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
);
