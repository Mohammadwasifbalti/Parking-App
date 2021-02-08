import React from "react";
import { connect } from "react-redux";
import firebase from "./firebase/firebaseConfig";
import "firebase/auth";
import "./App.css";
import Login from "./Components/Login/login";
import { Grid } from "@material-ui/core";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import Signup from "./Components/Signup/Signup";
import Parkings from "./Components/Parkings/Parkings";
import Home from "./Components/Home/Home";
class App extends React.Component {
  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log(user);
        this.props.authChange(user);
        if (user.uid !== "vms0ZrRU5tdCM5O6koARlut1cPk2") {
          firebase
            .database()
            .ref("User/" + user.uid)
            .on("value", (snapshot) => {
              this.props.userAdded(snapshot.val());
            });
          firebase
            .database()
            .ref("/Parkings")
            .on("value", (snapshot) => {
              console.log(snapshot.val());
              this.props.parkingSlot(snapshot.val());
            });
        } else {
          firebase
            .database()
            .ref("/Parkings")
            .on("value", (snapshot) => {
              console.log(snapshot.val());
              this.props.parkingSlot(snapshot.val());
            });
          firebase
            .database()
            .ref("Bookings")
            .on("value", (snapshot1) => {
              console.log(snapshot1.val());
              this.props.Bookings(snapshot1.val());
            });
          firebase
            .database()
            .ref("User")
            .on("value", (snapshot2) => {
              this.props.userAdded(snapshot2.val());
              console.log(snapshot2.val());
            });

          firebase
            .database()
            .ref("/Feedback")
            .on("value", (snapshot3) => {
              this.props.FeedbackAdding(snapshot3.val());
            });
        }
      } else this.props.authChange(false);
    });
  }
  render() {
    // console.log(this.props.parking)

    return (
      <Grid className="App">
        <Router>
          {this.props.auth ? <Redirect to="/parkings" /> : null}
          <Route exact path="/" component={Login} />
          <Route path="/signup" component={Signup} />
          <Route path="/dashboard" component={Home} />
          <Route path="/parkings" component={Parkings} />
        </Router>
      </Grid>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    auth: state.authReducer.auth,
    user: state.authReducer.user,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    authChange: (data) => dispatch({ type: "auth", payload: data }),
    parkingSlot: (data) => dispatch({ type: "Slots", payload: data }),
    userAdded: (data) => dispatch({ type: "user", payload: data }),
    Bookings: (data) => dispatch({ type: "Bookings", payload: data }),
    FeedbackAdding: (data) => dispatch({ type: "Feedback", payload: data }),
    temp: () => dispatch({ type: "temp", payload: Date.now() }),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(App);
