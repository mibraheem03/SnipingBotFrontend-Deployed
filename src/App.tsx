import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Login, Bots } from "./pages";
import store, { persistor } from "./store";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import ProtectedRoute from "./routes/ProtectedRoute";

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <Router>
       
            <Switch>
              <Route exact path="/" component={Login} />
              <ProtectedRoute exact path="/bots" component={Bots} />
            </Switch>
         
        </Router>
      </PersistGate>
    </Provider>
  );
}
