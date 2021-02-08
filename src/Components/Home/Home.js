import React, {Component} from 'react'
import { Grid } from '@material-ui/core';
import Navbar from '../Navbar/Navbar'
import {Route} from 'react-router-dom'
import ViewParking from '../Parkings/ViewParking';
import MyBookings from '../MyBookings/MyBookings';
import Students from '../Students/Students';
import Feedback from '../Feedback/Feedback';

class Home extends Component
{
    render()
    {
        return(
            <Grid>
                <Grid>
                    <h2 className='mainheading' style={{textAlign: 'center'}}>Online Parking System</h2>
                </Grid>
                <Navbar />
                <Route path='/dashboard/viewParking' component={ViewParking} />
                <Route path='/dashboard/myBookings' component={MyBookings} />
                <Route path='/dashboard/students' component={Students} />
                <Route path='/dashboard/feedback' component={Feedback} />


            </Grid>
        )
    }

}

export default Home;