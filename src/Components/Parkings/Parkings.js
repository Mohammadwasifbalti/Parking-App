import React, { Component } from "react";
import { Grid, Button } from "@material-ui/core";
import { connect } from "react-redux";
import "./parking.css";
import { Redirect } from "react-router-dom";

class Parkings extends Component {
  componentDidMount() {
    this.props.parkingPlace(false);
  }
  render() {
    console.log(this.props.parking);
    console.log(this.props.auth);
    if (this.props.auth === null) return <Redirect to="/" />;
    else
      return (
        <Grid>
          {this.props.auth.uid === "vms0ZrRU5tdCM5O6koARlut1cPk2" ? (
            <Redirect to="/dashboard/myBookings" />
          ) : this.props.parking ? (
            <Redirect to="/dashboard/viewParking" />
          ) : (
            <ParkingPlaces action={this.props.parkingPlace} />
          )}
        </Grid>
      );
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.authReducer.auth,
    parking: state.parkingReducer.parkingPlace,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    parkingPlace: (data) => dispatch({ type: "parkingPlace", payload: data }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Parkings);

class ParkingPlaces extends Component {
  selectingPlace(val) {
    this.props.action(val);
  }
  render() {
    return (
      <div className="background">
        <Grid container style={{ textAlign: "center" }}>
          <Grid item xs={12}>
            <h1 className="mainheading">Car Parking System</h1>
          </Grid>
          <Grid item xs={12} sm={4} lg={4} xl={4}>
            <Button
              id="a"
              onClick={() => this.selectingPlace("a")}
              className="parkingplace"
            >
              {" "}
              Place A
            </Button>
          </Grid>
          <Grid item xs={12} sm={4} lg={4} xl={4}>
            <Button
              id="b"
              onClick={() => this.selectingPlace("b")}
              className="parkingplace"
            >
              {" "}
              Place B
            </Button>
          </Grid>
          <Grid item xs={12} sm={4} lg={4} xl={4}>
            <Button
              id="c"
              onClick={() => this.selectingPlace("c")}
              className="parkingplace"
            >
              {" "}
              Place C
            </Button>
          </Grid>
        </Grid>
      </div>
    );
  }
}
