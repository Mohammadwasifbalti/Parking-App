import React, { Component } from "react";
import { Grid, Button } from "@material-ui/core";
import { connect } from "react-redux";
import "./MyBookings.css";
import { Redirect } from "react-router-dom";
import firebase from "../../firebase/firebaseConfig";

class MyBookings extends Component {
  Cancel(item, bookingId, bookingIndex) {
    console.log(item, bookingIndex, bookingId);
    if (item.startingTime > Date.now()) {
      let i;
      console.log(this.props.user.myBookings[bookingIndex]);
      let tempBooking = this.props.user.myBookings.filter(
        (items, index1) => Number(index1) !== Number(bookingIndex)
      );
      firebase
        .database()
        .ref("User/" + this.props.auth.uid + "/myBookings")
        .set(tempBooking)
        .then(() => {
          firebase
            .database()
            .ref("Bookings/" + bookingId + "/bookedSlot")
            .once("value")
            .then((snapshot) => {
              console.log(snapshot.val(), "place");
              firebase
                .database()
                .ref(
                  "Parkings/" +
                    snapshot.val().split(" ")[0] +
                    "/" +
                    snapshot.val()
                )
                .once("value")
                .then((snapshot1) => {
                  for (i = 0; i < snapshot1.val().bookingId.length; i++) {
                    if (
                      Number(snapshot1.val().bookingId[i]) === Number(bookingId)
                    )
                      break;
                  }
                  if (i < snapshot1.val().bookingId.length) {
                    let bookingID = snapshot1
                      .val()
                      .bookingId.filter((items, index) => index !== i);
                    let bookedBy = snapshot1
                      .val()
                      .bookedBy.filter((items, index) => index !== i);
                    let startingTime = snapshot1
                      .val()
                      .startingTime.filter((items, index) => index !== i);
                    let endingTime = snapshot1
                      .val()
                      .endingTime.filter((items, index) => index !== i);
                    firebase
                      .database()
                      .ref(
                        "Parkings/" +
                          snapshot.val().split(" ")[0] +
                          "/" +
                          snapshot.val()
                      )
                      .update({
                        bookedBy: bookedBy,
                        bookingId: bookingID,
                        startingTime: startingTime,
                        endingTime: endingTime,
                      })
                      .then(() => {
                        firebase
                          .database()
                          .ref("Bookings/")
                          .update({
                            [bookingId]: null,
                          });
                        console.log("removed from bookings");
                      });
                  }
                });
            });
        });
    } else {
      console.log("time out");
    }
  }
  CancellingByAdmin(tempId, items, bookingIndex) {
    console.log(bookingIndex);
    console.log(items);
    console.log(tempId);
    tempId = tempId.toString();
    if (items.startingTime > Date.now()) {
      let i, tempUid;
      Object.keys(this.props.user).forEach((item, index) => {
        console.log(this.props.user[item]);
        if (this.props.user[item].email === items.bookedBy) {
          tempUid = item;
          console.log(tempUid);
        }
      });
      console.log(this.props.user);
      console.log(this.props.user[tempUid].myBookings);
      let deletingBookings = this.props.user[tempUid].myBookings.filter(
        (item3, index) => item3[tempId] !== undefined
      );
      console.log(deletingBookings);
      firebase
        .database()
        .ref("User/" + tempUid + "/myBookings")
        .set(deletingBookings)
        .then(() => {
          firebase
            .database()
            .ref("Bookings/" + Number(tempId) + "/bookedSlot")
            .once("value")
            .then((snapshot) => {
              firebase
                .database()
                .ref(
                  "Parkings/" +
                    snapshot.val().split(" ")[0] +
                    "/" +
                    snapshot.val()
                )
                .once("value")
                .then((snapshot1) => {
                  for (i = 0; i < snapshot1.val().bookingId.length; i++) {
                    if (snapshot1.val().bookingId[i] === Number(tempId)) break;
                  }
                  if (i < snapshot1.val().bookingId.length) {
                    let bookingID = snapshot1
                      .val()
                      .bookingId.filter((items, index) => index !== i);
                    let bookedBy = snapshot1
                      .val()
                      .bookedBy.filter((items, index) => index !== i);
                    let startingTime = snapshot1
                      .val()
                      .startingTime.filter((items, index) => index !== i);
                    let endingTime = snapshot1
                      .val()
                      .endingTime.filter((items, index) => index !== i);
                    firebase
                      .database()
                      .ref(
                        "Parkings/" +
                          snapshot.val().split(" ")[0] +
                          "/" +
                          snapshot.val()
                      )
                      .update({
                        bookedBy: bookedBy,
                        bookingId: bookingID,
                        startingTime: startingTime,
                        endingTime: endingTime,
                      })
                      .then(() => {
                        firebase
                          .database()
                          .ref("Bookings/")
                          .update({
                            [tempId]: null,
                          });
                      });
                  }
                });
            });
        });
    }
  }
  render() {
    console.log(this.props.bookings);
    console.log(this.props.user);
    if (!this.props.auth) {
      return <Redirect to="/" />;
    } else if (this.props.auth.uid !== "vms0ZrRU5tdCM5O6koARlut1cPk2")
      return (
        <Grid>
          <h2 className="bookingsHeading">My Bookings</h2>
          {this.props.user ? (
            (this.props.user.myBookings &&
              this.props.user.myBookings.length === 0) ||
            !this.props.user.myBookings ? (
              <h3 style={{ textAlign: "center", marginTop: "20vh" }}>
                No Bookings....
              </h3>
            ) : (
              <Grid container>
                <Grid item xs={1} xm={1} lg={1} xl={1}>
                  <h3
                    style={{ textAlign: "center", overflowX: "hidden" }}
                    className="bookingshead"
                  >
                    S.NO
                  </h3>
                </Grid>
                <Grid item xs={3} xm={3} lg={3} xl={3}>
                  <h3
                    style={{ textAlign: "center", overflowX: "hidden" }}
                    className="bookingshead"
                  >
                    Booking ID
                  </h3>
                </Grid>
                <Grid item xs={2} xm={2} lg={2} xl={2}>
                  <h3
                    style={{ textAlign: "center", overflowX: "hidden" }}
                    className="bookingshead"
                  >
                    Booking Date
                  </h3>
                </Grid>
                <Grid item xs={1} xm={1} lg={1} xl={1}>
                  <h3
                    style={{ textAlign: "center", overflowX: "hidden" }}
                    className="bookingshead"
                  >
                    Slot
                  </h3>
                </Grid>
                <Grid item xs={3} xm={3} lg={3} xl={3}>
                  <h3
                    style={{ textAlign: "center", overflowX: "hidden" }}
                    className="bookingshead"
                  >
                    Time
                  </h3>
                </Grid>
                <Grid item xs={2} xm={2} lg={2} xl={2}>
                  <h3
                    style={{ textAlign: "center", overflowX: "hidden" }}
                    className="bookingshead"
                  >
                    Cancel Booking
                  </h3>
                </Grid>
                {this.props.user.myBookings &&
                  this.props.user.myBookings.map((items, index) =>
                    Object.keys(items).map((items1, index1) => (
                      <Grid
                        key={index}
                        className={"lineno" + (index % 2)}
                        container
                      >
                        <Grid item xs={1} xm={1} lg={1} xl={1}>
                          <h5 style={{ textAlign: "center" }}>{index + 1}</h5>
                        </Grid>
                        <Grid item xs={3} xm={3} lg={3} xl={3}>
                          <h5
                            style={{ textAlign: "center", overflowX: "hidden" }}
                          >
                            {" "}
                            {items1}{" "}
                          </h5>
                        </Grid>
                        <Grid item xs={2} xm={2} lg={2} xl={2}>
                          <h5
                            style={{ textAlign: "center", overflowX: "hidden" }}
                          >
                            {" "}
                            {
                              new Date(items[items1].startingTime)
                                .toDateString()
                                .split(" ")[2]
                            }{" "}
                            {
                              new Date(items[items1].startingTime)
                                .toDateString()
                                .split(" ")[1]
                            }{" "}
                            {
                              new Date(items[items1].startingTime)
                                .toDateString()
                                .split(" ")[3]
                            }{" "}
                          </h5>
                        </Grid>
                        <Grid item xs={1} xm={1} lg={1} xl={1}>
                          <h5
                            style={{
                              textAlign: "center",
                              textTransform: "uppercase",
                            }}
                          >
                            {" "}
                            {items[items1].bookedSlot}{" "}
                          </h5>
                        </Grid>
                        <Grid item xs={3} xm={3} lg={3} xl={3}>
                          <h5 style={{ textAlign: "center" }}>
                            {
                              new Date(items[items1].startingTime)
                                .toTimeString()
                                .split(" ")[0]
                                .split(":")[0]
                            }
                            :
                            {
                              new Date(items[items1].startingTime)
                                .toTimeString()
                                .split(" ")[0]
                                .split(":")[1]
                            }{" "}
                            &nbsp;-&nbsp;{" "}
                            {
                              new Date(items[items1].endingTime)
                                .toTimeString()
                                .split(" ")[0]
                                .split(":")[0]
                            }
                            :
                            {
                              new Date(items[items1].endingTime)
                                .toTimeString()
                                .split(" ")[0]
                                .split(":")[1]
                            }{" "}
                          </h5>
                        </Grid>
                        <Grid
                          style={{ textAlign: "center" }}
                          item
                          xs={2}
                          xm={2}
                          lg={2}
                          xl={2}
                        >
                          <Button
                            style={{
                              width: "50%",
                              height: "100%",
                              verticalAlign: "middle",
                            }}
                            onClick={() =>
                              this.Cancel(items[items1], items1, index)
                            }
                          >
                            Cancel
                          </Button>
                        </Grid>
                      </Grid>
                    ))
                  )}
              </Grid>
            )
          ) : null}
        </Grid>
      );
    else
      return (
        <Grid>
          {this.props.bookings &&
          Object.keys(this.props.bookings).length > 0 ? (
            <Grid container>
              <Grid item xs={12}>
                <h2 className="bookingsHeading">All Bookings</h2>
              </Grid>
              <Grid item xs={1} xm={1} lg={1} xl={1}>
                <h3
                  style={{ textAlign: "center", overflowX: "hidden" }}
                  className="bookingshead"
                >
                  S.NO
                </h3>
              </Grid>
              <Grid item xs={2} xm={2} lg={2} xl={2}>
                <h3
                  style={{ textAlign: "center", overflowX: "hidden" }}
                  className="bookingshead"
                >
                  Booking ID
                </h3>
              </Grid>
              <Grid item xs={2} xm={2} lg={2} xl={2}>
                <h3
                  style={{ textAlign: "center", overflowX: "hidden" }}
                  className="bookingshead"
                >
                  Booked By
                </h3>
              </Grid>
              <Grid item xs={2} xm={2} lg={2} xl={2}>
                <h3
                  style={{ textAlign: "center", overflowX: "hidden" }}
                  className="bookingshead"
                >
                  Booking Date
                </h3>
              </Grid>
              <Grid item xs={1} xm={1} lg={1} xl={1}>
                <h3
                  style={{ textAlign: "center", overflowX: "hidden" }}
                  className="bookingshead"
                >
                  Slot
                </h3>
              </Grid>
              <Grid item xs={2} xm={2} lg={2} xl={2}>
                <h3
                  style={{ textAlign: "center", overflowX: "hidden" }}
                  className="bookingshead"
                >
                  Time
                </h3>
              </Grid>
              <Grid item xs={2} xm={2} lg={2} xl={2}>
                <h3
                  style={{ textAlign: "center", overflowX: "hidden" }}
                  className="bookingshead"
                >
                  Cancel Booking
                </h3>
              </Grid>
              {Object.keys(this.props.bookings).map((items, index) => (
                <Grid key={index} className={"lineno" + (index % 2)} container>
                  <Grid item xs={1} xm={1} lg={1} xl={1}>
                    <h5 style={{ textAlign: "center" }}>{index + 1}</h5>
                  </Grid>
                  <Grid item xs={2} xm={2} lg={2} xl={2}>
                    <h5 style={{ textAlign: "center", overflowX: "hidden" }}>
                      {" "}
                      {items}{" "}
                    </h5>
                  </Grid>
                  <Grid item xs={2} xm={2} lg={2} xl={2}>
                    <h5 style={{ textAlign: "center", overflowX: "hidden" }}>
                      {" "}
                      {this.props.bookings[items].bookedBy}{" "}
                    </h5>
                  </Grid>
                  <Grid item xs={2} xm={2} lg={2} xl={2}>
                    <h5 style={{ textAlign: "center", overflowX: "hidden" }}>
                      {" "}
                      {
                        new Date(this.props.bookings[items].startingTime)
                          .toDateString()
                          .split(" ")[2]
                      }{" "}
                      {
                        new Date(this.props.bookings[items].startingTime)
                          .toDateString()
                          .split(" ")[1]
                      }{" "}
                      {
                        new Date(this.props.bookings[items].startingTime)
                          .toDateString()
                          .split(" ")[3]
                      }{" "}
                    </h5>
                  </Grid>
                  <Grid item xs={1} xm={1} lg={1} xl={1}>
                    <h5
                      style={{
                        textAlign: "center",
                        textTransform: "uppercase",
                      }}
                    >
                      {" "}
                      {this.props.bookings[items].bookedSlot}{" "}
                    </h5>
                  </Grid>
                  <Grid item xs={2} xm={2} lg={2} xl={2}>
                    <h5 style={{ textAlign: "center" }}>
                      {
                        new Date(this.props.bookings[items].startingTime)
                          .toTimeString()
                          .split(" ")[0]
                          .split(":")[0]
                      }
                      :
                      {
                        new Date(this.props.bookings[items].startingTime)
                          .toTimeString()
                          .split(" ")[0]
                          .split(":")[1]
                      }{" "}
                      &nbsp;-&nbsp;{" "}
                      {
                        new Date(this.props.bookings[items].endingTime)
                          .toTimeString()
                          .split(" ")[0]
                          .split(":")[0]
                      }
                      :
                      {
                        new Date(this.props.bookings[items].endingTime)
                          .toTimeString()
                          .split(" ")[0]
                          .split(":")[1]
                      }{" "}
                    </h5>
                  </Grid>
                  <Grid
                    style={{ textAlign: "center" }}
                    item
                    xs={2}
                    xm={2}
                    lg={2}
                    xl={2}
                  >
                    <Button
                      style={{
                        width: "50%",
                        height: "100%",
                        verticalAlign: "middle",
                      }}
                      onClick={() =>
                        this.CancellingByAdmin(
                          items,
                          this.props.bookings[items],
                          index
                        )
                      }
                    >
                      Cancel
                    </Button>
                  </Grid>
                </Grid>
              ))}
            </Grid>
          ) : !this.props.bookings ? null : (
            <h4 style={{ textAlign: "center" }}>No Bookings</h4>
          )}
        </Grid>
      );
  }
}
const mapStateToProps = (state) => {
  return {
    auth: state.authReducer.auth,
    user: state.authReducer.user,
    bookings: state.parkingReducer.Bookings,
    temp: state.parkingReducer.temp,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    bookingsChange: (data) => dispatch({ type: "Bookings", payload: data }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MyBookings);
