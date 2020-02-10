import React, { Suspense, lazy } from "react";
import { Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PrivateRoute from "./components/PrivateRoute";

const Home = lazy(() => import("./containers/Home"));
const About = lazy(() => import("./containers/About"));
const Admin = lazy(() => import("./containers/Admin"));
const Profile = lazy(() => import("./containers/Profile"));
const Contacts = lazy(() => import("./containers/Contacts"));
const Thanks = lazy(() => import("./containers/Thanks"));
const Paymentfailed = lazy(() => import("./containers/Paymentfailed"));
const Shop = lazy(() => import("./containers/Shop"));
const Cart = lazy(() => import("./containers/Cart"));

function Routes(auth) {
  console.log("routes: auth", auth);
  if (!auth || auth == undefined) return;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Switch>
        <Route exact path="/" component={Shop} />
        <Route exact path="/shop" component={Shop} />
        <Route exact path="/sale" component={Home} />
        <Route exact path="/playground" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/cart" component={Cart} />
        <Route path="/profile" component={Profile} />
        <Route path="/contacts" component={Contacts} />
        <Route path="/thanks" component={Thanks} />
        <Route path="/paymentfailed" component={Paymentfailed} />
        <PrivateRoute user={auth.user} path="/admin" component={Admin} />
      </Switch>
    </Suspense>
  );
}

const mapStateToProps = ({ auth }) => ({
  user: auth.user.nick
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Routes);
