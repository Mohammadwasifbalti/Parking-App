import React, { Component } from "react";
import { Grid, Button } from "@material-ui/core";
import { connect } from "react-redux";
import firebase from "../../firebase/firebaseConfig";
import "./Navbar.css";
import { Link } from "react-router-dom";

class Navbar extends Component {
  Logout() {
    this.props.parkingPlace();
    firebase.auth().signOut();
  }
  render() {
    return (
      <Grid>
        {this.props.user &&
        this.props.user.uid !== "vms0ZrRU5tdCM5O6koARlut1cPk2" ? (
          <Grid>
            <Grid container className="Navbar">
              <Grid item xs={12} sm={3} lg={3} xl={3}>
                <Link to="/dashboard/viewParking">
                  <Button className="Buttons">View Parking</Button>
                </Link>
              </Grid>
              <Grid item xs={12} sm={3} lg={3} xl={3}>
                <Link to="/dashboard/myBookings">
                  <Button className="Buttons">My Bookings</Button>
                </Link>
              </Grid>
              <Grid item xs={12} sm={3} lg={3} xl={3}>
                <Link to="/dashboard/feedback">
                  <Button className="Buttons">Feedback</Button>
                </Link>
              </Grid>
              <Grid item xs={12} sm={3} lg={3} xl={3}>
                <Button onClick={() => this.Logout()} className="Buttons">
                  Logout
                </Button>
              </Grid>
            </Grid>
            {this.props.userInfo ? (
              <Grid>
                <h2 className="userName">User: {this.props.userInfo.name} </h2>
              </Grid>
            ) : null}
          </Grid>
        ) : (
          <Grid>
            <Grid
              container
              className="Navbar"
              style={{ justifyContent: "space-around" }}
            >
              <Grid item xs={12} sm={3} lg={3} xl={3}>
                <Link to="/dashboard/myBookings">
                  <Button className="Buttons">View Bookings</Button>
                </Link>
              </Grid>
              <Grid item xs={12} sm={3} lg={3} xl={3}>
                <Link to="/dashboard/students">
                  <Button className="Buttons">View Students</Button>
                </Link>
              </Grid>
              <Grid item xs={12} sm={3} lg={3} xl={3}>
                <Link to="/dashboard/feedback">
                  <Button className="Buttons">View Feedback</Button>
                </Link>
              </Grid>
              <Grid item xs={12} sm={3} lg={3} xl={3}>
                <Button
                  onClick={() => {
                    firebase.auth().signOut();
                  }}
                  className="Buttons"
                >
                  Logout
                </Button>
              </Grid>
            </Grid>
            <Grid>
              <h2 className="userName">Admin </h2>
            </Grid>
          </Grid>
        )}
      </Grid>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    user: state.authReducer.auth,
    userInfo: state.authReducer.user,
    parkingPlaces: state.parkingReducer.parkingPlace,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    parkingPlace: () => dispatch({ type: "parkingPlace", payload: false }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
