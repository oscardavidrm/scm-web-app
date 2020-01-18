import React, {Component} from 'react';
import {withApollo} from 'react-apollo';
import {Switch, Route, Redirect, withRouter} from 'react-router-dom';
import jwt from 'jsonwebtoken';
import cookie from 'react-cookies';
import './App.css';
import {JWT_SECRET} from 'config';
import {Admin, Auth, Cashier, Guard} from 'views';

class App extends Component {
  render() {
    const token = cookie.load('token');
    const user = token ? jwt.verify(token, JWT_SECRET) : null;

    const {
      history: {
        location: {pathname},
      },
    } = this.props;

    return (
      <Switch>
        {user && user.role === 'ADMIN' && <Redirect from="/auth" to="/admin" />}
        {user && user.role === 'GUARD' && <Redirect from="/auth" to="/guard" />}
        {user && user.role === 'CASHIER' && <Redirect from="/auth" to="/cashier" />}
        <Route path="/auth" render={() => <Auth />} />
        {!user && <Redirect from={`${pathname}`} to="/auth" />}
        <Route path="/admin" render={() => <Admin />} />
        <Route path="/cashier" render={() => <Cashier />} />
        <Route path="/guard" render={() => <Guard />} />
      </Switch>
    );
  }
}

export default withRouter(withApollo(App));
