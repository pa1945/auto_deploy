import React from 'react';
import { Route, Switch, Redirect, RouteComponentProps } from 'react-router';
import App from './containers/App';
import { hot } from 'react-hot-loader';
import './style.local.css';

export interface Props {}

export interface State {
  showLoader: boolean;
}
export class Root extends React.Component<Props, State> {
  state = {
    showLoader: true,
  };

  componentDidMount() {
    if (!window.localStorage.getItem('backendUrl')) {
      window.localStorage.setItem('backendUrl', process.env.API_URL || '');
      console.log("1. API_URL: ", process.env.API_URL);
    }
    setTimeout(() => this.setState({ showLoader: false }), 1000);
  }
  render() {
    return (
      <div>
        <Switch>
          <Route exact path="/" render={() => <Redirect to="/employees" />} />
          <Route
            render={(props: RouteComponentProps<void>) => {
              return <App {...props} />;
            }}
          />
        </Switch>
      </div>
    );
  }
}

export default hot(module)(Root);
