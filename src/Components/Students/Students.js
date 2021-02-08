import React, { Component } from "react";
import { Grid } from "@material-ui/core";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

class Students extends Component {
  render() {
    console.log(this.props.user);
    if (
      !this.props.auth ||
      this.props.auth.uid !== "vms0ZrRU5tdCM5O6koARlut1cPk2"
    )
      return <Redirect to="/" />;
    else
      return (
        <Grid>
          {this.props.user && Object.keys(this.props.user).length > 0 ? (
            <Grid container>
              <Grid item xs={12}>
                <h2 className="bookingsHeading">All Students</h2>
              </Grid>
              <Grid item xs={2} xm={2} lg={2} xl={2}>
                <h3
                  style={{ textAlign: "center", overflowX: "hidden" }}
                  className="bookingshead"
                >
                  S.NO
                </h3>
              </Grid>
              <Grid item xs={4} xm={4} lg={4} xl={4}>
                <h3
                  style={{ textAlign: "center", overflowX: "hidden" }}
                  className="bookingshead"
                >
                  Student Name
                </h3>
              </Grid>
              <Grid item xs={3} xm={3} lg={3} xl={3}>
                <h3
                  style={{ textAlign: "center", overflowX: "hidden" }}
                  className="bookingshead"
                >
                  Student Email
                </h3>
              </Grid>
              <Grid item xs={3} xm={3} lg={3} xl={3}>
                <h3
                  style={{ textAlign: "center", overflowX: "hidden" }}
                  className="bookingshead"
                >
                  No of Bookings
                </h3>
              </Grid>
              {Object.keys(this.props.user).map((items, index) => (
                <Grid key={index} className={"lineno" + (index % 2)} container>
                  <Grid item xs={2} xm={2} lg={2} xl={2}>
                    <h5 style={{ textAlign: "center" }}>{index + 1}</h5>
                  </Grid>
                  <Grid item xs={4} xm={4} lg={4} xl={4}>
                    <h5 style={{ textAlign: "center", overflowX: "hidden" }}>
                      {" "}
                      {this.props.user[items].name}{" "}
                    </h5>
                  </Grid>
                  <Grid item xs={3} xm={3} lg={3} xl={3}>
                    <h5 style={{ textAlign: "center", overflowX: "hidden" }}>
                      {" "}
                      {this.props.user[items].email}{" "}
                    </h5>
                  </Grid>
                  <Grid item xs={3} xm={3} lg={3} xl={3}>
                    <h5
                      style={{
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}
                    >
                      {" "}
                      {this.props.user[items].myBookings
                        ? this.props.user[items].myBookings.length
                        : 0}{" "}
                    </h5>
                  </Grid>
                </Grid>
              ))}
            </Grid>
          ) : (
            <h4 style={{ textAlign: "center" }}>No Students</h4>
          )}
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

export default connect(mapStateToProps)(Students);
