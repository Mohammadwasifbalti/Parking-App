import React, { useState } from "react";
import { Grid, TextField, Button } from "@material-ui/core";
import { connect } from "react-redux";
import "./Feedback.css";
import firebase from "../../firebase/firebaseConfig";
import { Redirect } from "react-router-dom";

function Feedback(props) {
  const [feedback, changeFeedback] = useState("");
  const [popup, changePopupState] = useState(0);
  console.log(props.feedback);
  const onchangeFeedback = (e) => {
    changeFeedback(e.target.value);
  };
  const SubmitFeedback = () => {
    if (feedback !== "") {
      firebase
        .database()
        .ref("Feedback/" + Date.now())
        .set({
          feedback: feedback,
          by: props.auth.email,
        })
        .then(() => {
          changeFeedback("");
          changePopupState(1);
          setTimeout(() => {
            changePopupState(0);
          }, 3000);
        });
    }
  };
  if (props.auth && props.auth.uid !== "vms0ZrRU5tdCM5O6koARlut1cPk2")
    return (
      <Grid className="Feedback">
        <Grid className="feedbackpopup" style={{ opacity: popup }} item xs={12}>
          <h2>Feedback Added</h2>
        </Grid>
        <Grid item xs={12}>
          <h2 className="bookingsHeading">Feedback</h2>
        </Grid>
        <TextField
          id="outlined-multiline-static"
          label="Feedback"
          multiline
          rows="8"
          value={feedback}
          onChange={(e) => onchangeFeedback(e)}
          className="feedbackfield"
          variant="outlined"
        />
        <Grid container>
          <Grid item xs={6}>
            <Button
              onClick={() => changeFeedback("")}
              className="feedbackButtons"
            >
              Cancel
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              onClick={() => SubmitFeedback()}
              className="feedbackButtons"
            >
              Send
            </Button>
          </Grid>
        </Grid>
      </Grid>
    );
  else if (props.auth)
    return (
      <Grid>
        {props.feedback && Object.keys(props.feedback).length > 0 ? (
          <Grid container>
            <Grid item xs={12}>
              <h2 className="bookingsHeading">Feedback</h2>
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
                Student email
              </h3>
            </Grid>
            <Grid item xs={6} xm={6} lg={6} xl={6}>
              <h3
                style={{ textAlign: "center", overflowX: "hidden" }}
                className="bookingshead"
              >
                Feedback
              </h3>
            </Grid>
            {Object.keys(props.feedback).map((items, index) => (
              <Grid key={index} className={"lineno" + (index % 2)} container>
                <Grid item xs={2} xm={2} lg={2} xl={2}>
                  <h5 style={{ textAlign: "center" }}>{index + 1}</h5>
                </Grid>
                <Grid item xs={4} xm={4} lg={4} xl={4}>
                  <h5 style={{ textAlign: "center", overflowX: "hidden" }}>
                    {" "}
                    {props.feedback[items].by}{" "}
                  </h5>
                </Grid>
                <Grid item xs={6} xm={6} lg={6} xl={6}>
                  <h5 style={{ textAlign: "center", overflowX: "hidden" }}>
                    {" "}
                    {props.feedback[items].feedback}{" "}
                  </h5>
                </Grid>
              </Grid>
            ))}
          </Grid>
        ) : (
          <h4 style={{ textAlign: "center" }}>No Feedback</h4>
        )}
      </Grid>
    );
  else return <Redirect to="/" />;
}
const mapStateToProps = (state) => {
  return {
    auth: state.authReducer.auth,
    feedback: state.parkingReducer.Feedback,
  };
};

export default connect(mapStateToProps)(Feedback);
