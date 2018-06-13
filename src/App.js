import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { NotificationContainer } from "react-notifications";
import "react-notifications/lib/notifications.css";
import "./App.css";

import Users from "./components/Users";
import TimeLine from "./components/TimeLine";

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
