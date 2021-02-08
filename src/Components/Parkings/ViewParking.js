import React, { Component } from 'react'
import { Grid, Button, TextField } from '@material-ui/core'
import { connect } from 'react-redux';
import TimePicker from 'react-time-picker';
import './ViewParking.css'
import firebase from '../../firebase/firebaseConfig'
import { Redirect } from 'react-router-dom';

class ViewParking extends Component
{
    constructor()
    {
        super();
        this.state = 
        {
            selectedSlot: false,
            selectedDate: '',
            class: '',
            startingTime: '',
            endTime: '',
            dateInMiliseconds: '',
            startingTimeInMiliseconds: '',
            endTimeInMiliseconds: ''
        }
    }
    Booking()
    {
      if(this.state.endTimeInMiliseconds>this.state.startingTimeInMiliseconds && this.state.startingTimeInMiliseconds > Date.now())
      {
        let Datenow = Date.now();
        console.log(this.state.startingTimeInMiliseconds)
        let tempBookingEnding = this.props.ViewParking[this.props.parkingPlace][this.state.selectedSlot].endingTime;
        tempBookingEnding.push(Number(this.state.endTimeInMiliseconds))
        let tempBookingStarting = this.props.ViewParking[this.props.parkingPlace][this.state.selectedSlot].startingTime;
        tempBookingStarting.push(Number(this.state.startingTimeInMiliseconds))
        let tempBookingId = this.props.ViewParking[this.props.parkingPlace][this.state.selectedSlot].bookingId;
        tempBookingId.push(Datenow);
        let tempBookedBy = this.props.ViewParking[this.props.parkingPlace][this.state.selectedSlot].bookedBy;
        tempBookedBy.push(this.props.auth.email)
        firebase.database().ref('Parkings/' + this.props.parkingPlace + '/' + this.state.selectedSlot).update({
            startingTime: tempBookingStarting,
            endingTime: tempBookingEnding,
            bookingId: tempBookingId,
            bookedBy: tempBookedBy
        })
        .then(()=>{
          firebase.database().ref('Bookings/' + Datenow)
          .set(
            {
              startingTime: Number(this.state.startingTimeInMiliseconds),
              endingTime: Number(this.state.endTimeInMiliseconds),
              bookedBy: this.props.auth.email,
              bookedSlot: this.state.selectedSlot
            }
            )
            .then(()=>
            {
              let newBookings = [];
              if(this.props.user.myBookings)
              newBookings = this.props.user.myBookings;
              newBookings.unshift({[Datenow]: {
                startingTime:  Number(this.state.startingTimeInMiliseconds),
                endingTime: Number(this.state.endTimeInMiliseconds),
                bookedSlot: this.state.selectedSlot
              }})
              firebase.database().ref('User/' + this.props.auth.uid).update({myBookings: newBookings}).then(()=>{

                this.setState({selectedSlot: false})})

              })
            })
          }
          else
          {

          }
    }
    selectingSlot(val)
    {
        this.setState({selectedSlot: val})
    }
    selectingDate(e)
    {
        let date = e.target.value.split('-');
        date[1] = date[1]-1;
        date = new Date(date[0], date[1], date[2]).getTime();
        if(date > Date.now() - 86400000)
        {
            this.setState({selectedDate:  e.target.value,
              dateInMiliseconds: date,
              endTime: '',
              endTimeInMiliseconds: '',
              startingTime: '',
              startingTimeInMiliseconds: ''
          })
        }
    }
    TimeandHour(e, id)
    {
      let tempTime = new Date(this.state.selectedDate + ',' + e).getTime();
      if(id === 'endTime')
      {
        if(this.state.startingTimeInMiliseconds > Date.now() && this.state.selectedDate && this.state.time !=='' && this.state.startingTimeInMiliseconds < tempTime )
        {
          this.setState({
            endTime: e,
            endTimeInMiliseconds: new Date(this.state.selectedDate + ',' + e).getTime()})
        }
        else
        {
          this.setState({
            endTime: '',
            endTimeInMiliseconds: ''})
        }
      }
      if(id === 'startingTime')
      {
        if( this.state.selectedDate && (new Date(this.state.selectedDate + ',' + e).getTime()) > Date.now())
        {
          console.log(new Date(this.state.selectedDate + ',' + e).getTime())
          this.setState({
            startingTime: e, 
            startingTimeInMiliseconds: new Date(this.state.selectedDate + ',' + e).getTime()})
        }
        else
        {
          this.setState({
            startingTime: '', 
            startingTimeInMiliseconds: ''})
        }
      }
    }
    RerenderingComponent(end)
    {
        setTimeout(() => {
            this.setState({class: Date.now()});
        }, end - Date.now());
    }
    render()
    {
        console.log(this.props.user)
        console.log(this.state.selectedSlot)
        console.log(this.props.ViewParking)
        if(!this.props.auth)
        {
            return <Redirect to='/' />
        }
        else if(!this.props.parkingPlace)
        {
          return <Redirect to='/parkings' />
        }
        else
        return(
          <div style={{marginBottom: '5vh'}}>
                <div style={{textAlign: 'center', width: '100%', textDecoration: 'underline', textTransform: 'uppercase'}}><h2>View Parking</h2></div>
                <div style={{textAlign: "right", width:'50%', display: 'inline-block'}}><h3>Select Date : &nbsp;</h3></div>
                <div style={{textAlign: 'left', width:'50%', display: 'inline-block'}}>
                <TextField
                  id="date"
                  type="date"
                  onChange={(e)=>this.selectingDate(e)}
                  value={this.state.selectedDate}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                </div>
                <div className='timeSelector' style={{textAlign: 'right', display: 'inline-block'}}><h3>Select selecting Time : &nbsp;</h3></div>
                <div className='timeSelector' style={{textAlign: 'left', display: 'inline-block'}} >
                  <TimePicker
                    clockClassName='clock'
                    // minTime={this.state.dateInMiliseconds < Date.now() ? new Date().getHours() + ":" + new Date().getMinutes(): false}
                    onChange={(e)=>this.TimeandHour(e, 'startingTime')}
                    value={this.state.startingTime}
                  />
                  {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardTimePicker
                      margin="normal"
                      id="time-picker"
                      label="Time picker"
                      value={this.state.time}
                      onChange={(e)=>this.TimeandHour(e, 'time')}
                      KeyboardButtonProps={{
                        'aria-label': 'change time',
                      }}
                    />
                  </MuiPickersUtilsProvider> */}
                  {/* <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={this.state.time}
                    onChange={(e)=>this.TimeandHour(e, 'time')}
                    labelWidth={40}
                  >
                    
                    <MenuItem value={0}>12 AM</MenuItem>
                    <MenuItem value={1}>1 AM</MenuItem>
                    <MenuItem value={2}>2 AM</MenuItem>
                    <MenuItem value={3}>3 AM</MenuItem>
                    <MenuItem value={4}>4 AM</MenuItem>
                    <MenuItem value={5}>5 AM</MenuItem>
                    <MenuItem value={6}>6 AM</MenuItem>
                    <MenuItem value={7}>7 AM</MenuItem>
                    <MenuItem value={8}>8 AM</MenuItem>
                    <MenuItem value={9}>9 AM</MenuItem>
                    <MenuItem value={10}>10 AM</MenuItem>
                    <MenuItem value={11}>11 AM</MenuItem>
                    <MenuItem value={12}>12 PM</MenuItem>
                    <MenuItem value={13}>1 PM</MenuItem>
                    <MenuItem value={14}>2 PM</MenuItem>
                    <MenuItem value={15}>3 PM</MenuItem>
                    <MenuItem value={16}>4 PM</MenuItem>
                    <MenuItem value={17}>5 PM</MenuItem>
                    <MenuItem value={18}>6 PM</MenuItem>
                    <MenuItem value={19}>7 PM</MenuItem>
                    <MenuItem value={20}>8 PM</MenuItem>
                    <MenuItem value={21}>9 PM</MenuItem>
                    <MenuItem value={22}>10 PM</MenuItem>
                    <MenuItem value={23}>11 PM</MenuItem>                  
                  </Select> */}
                </div>
                <div className='timeSelector' style={{textAlign: 'right', display: 'inline-block'}}><h3>Select End Time : &nbsp;</h3></div>
                <div className='timeSelector' style={{textAlign: 'left', display: 'inline-block'}}>
                  <TimePicker
                      clockClassName='clock'
                      minTime={this.state.startingTime}
                      onChange={(e)=>this.TimeandHour(e, 'endTime')}
                      value={this.state.endTime}
                    />
                </div>
            <Grid container spacing={0} style={{marginTop: '5vh', overflowX: 'hidden'}}>
                {(this.props.ViewParking && this.state.endTimeInMiliseconds > this.state.startingTimeInMiliseconds && this.state.selectedDate !== '' ? 
                 <> {Object.keys(this.props.ViewParking[this.props.parkingPlace]).map((key,index)=>
                  {
                      this.props.ViewParking[this.props.parkingPlace][key].endingTime.forEach(items =>{
                        if(items>Date.now())
                        {
                          this.RerenderingComponent(items);
                        }

                      })
                      return(
                  <Grid className='grids' key={index} style={{textAlign: 'center', paddingRight: '0 !important'}} item xs={4} md={4} lg={3} >
                    <Button style={{backgroundColor: (this.state.selectedSlot === key ?  'greenyellow':'gainsboro')}} disabled={
                      this.props.ViewParking[this.props.parkingPlace][key].endingTime.filter((items, index)=>
                        (this.props.ViewParking[this.props.parkingPlace][key].endingTime[index] > this.state.startingTimeInMiliseconds) && (this.props.ViewParking[this.props.parkingPlace][key].startingTime[index] < this.state.endTimeInMiliseconds)).length !== 0
                  } onClick={()=>this.selectingSlot(key)} className={'buttons ' + this.state.class}>{key}</Button>
                  </Grid>
                  )
                }
                )}
                {(this.state.selectedSlot ?
                <Grid container style={{textAlign: 'center'}} spacing={2}> 
                    <Grid item xs={12}>
                        <h4 style={{textAlign: 'center', textTransform: 'uppercase'}}>Selected Slot: {this.state.selectedSlot}</h4>
                    </Grid>
                    <Grid item xs={6}>
                        <Button onClick={()=>this.setState({selectedSlot: false})}>Cancel</Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Button onClick={()=>this.Booking()}>Book</Button>
                    </Grid>
                </Grid>
                : null 
                )}</>
                : null)}
            </Grid>
            </div>  
        )
    }
}

const mapStateToProps = (state) =>{
    return{
        parkingPlace: state.parkingReducer.parkingPlace,
        ViewParking: state.parkingReducer.parkingSlots,
        auth: state.authReducer.auth,
        user: state.authReducer.user,
        bookings: state.parkingReducer.Bookings
    }
}
const mapDispatchToProps = (dispatch)=>{
  return{
    bookingsChange: (data)=>dispatch({type: 'Bookings', payload: data})
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(ViewParking);