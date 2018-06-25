import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { NotificationContainer } from "react-notifications";
import "react-notifications/lib/notifications.css";
import "antd/dist/antd.css";
import "./App.css";

import Users from "./views/Users";
import TimeLine from "./views/TimeLine";

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Route exact path="/" component={Users} />
          <Route exact path="/user/:id" component={TimeLine} />
          <NotificationContainer />
        </div>
      </Router>
    );
  }
}

export default App;
