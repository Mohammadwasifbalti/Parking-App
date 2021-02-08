import React, {Component} from 'react';
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid';
import {TextField} from '@material-ui/core';
import './Signup.css'
import firebase from '../../firebase/firebaseConfig'
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';


class Signup extends Component
{
    constructor()
    {
        super();
        this.state =
        {
            email: '',
            name: '',
            password: '',
            error: false
        }
    }
    onChange(e)
    {
        this.setState({[e.target.id]: e.target.value});
    }
    OnSignup()
    {
                firebase.auth().createUserWithEmailAndPassword(this.state.email,this.state.password)
                .then((user)=>
                {
                    firebase.database().ref('User/' + user.user.uid).set({
                        name: this.state.name,
                        email: this.state.email,
                    })
                    .then(()=>{
                        this.setState({email: '', name: '', password: ''})
                    })
                    console.log('signUp Successful')
                }
                )
                .catch(e=>{
                    console.log(e.code.split('/')[1])
                    this.setState({error: e.code.split('/')[1]})
                })
            
        console.log(this.state.email, this.state.password)

    }
    render()
    {    
        return(
            <Grid container className='app'>
            <div className='bgimg'></div>
            <Grid className='body' container direction='column' alignItems='center'>
              <Grid item xs={12} style={{margin: 'auto',marginBottom: '1vw'}}>
              <Link to='/' ><h1 className='mainheadingSignUp'>Car Parking System</h1></Link>
              </Grid>
              <Grid className='Login' item xs={8} style={{margin: 'auto'}}>
                  <form>
              <Grid container spacing={3} style={{textAlign: 'center', flexGrow: 1}}>
                    <Grid className='SignupPanel' container direction='row' spacing={2} >
                        <Grid item xs={12} >
                            <h1 className='signUpHeading' >Sign Up</h1>
                        </Grid>
                        <Grid item xs={12} >
                            <TextField onChange={(e)=>this.onChange(e)} value={this.state.name} type='text' id="name" label="NAME *" variant="outlined" />
                        </Grid>
                        <Grid item xs={12} >
                            <TextField onChange={(e)=>this.onChange(e)} value={this.state.email} type='text' id="email" label="EMAIL ID *" variant="outlined" />
                        </Grid>
                        <Grid item xs={12} >
                            <TextField onChange={(e)=>this.onChange(e)} value={this.state.password} id="password" type="password" label="Password *" variant="outlined" />                                    
                        </Grid>
                        {this.state.error ?
                        <Grid item xs={12}>
                            <p className='error'>{this.state.error}</p>
                        </Grid> : null}
                        
                        <Grid item xs={12} >
                                <Grid item xs={12} >                        
                                    <Button onClick={()=>this.OnSignup()} style={{borderRadius: 20, width: '30%', margin: 5, backgroundColor: 'green'}} variant="contained" color="primary" >Sign Up</Button>
                                </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid item xs={12} >
                                <p>Already have an Account? <Link to='/'>Login</Link></p>
                            </Grid>
                        </Grid>
                    </Grid>

                </Grid>
              </form>
              </Grid>
        </Grid>
      </Grid>
        )
    }
}
const mapStateToProps = (state) =>
{
    return{
        auth: state.authReducer.auth
    }
}

export default connect(mapStateToProps)(Signup);