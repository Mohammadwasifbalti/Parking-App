import {combineReducers} from 'redux'
import authReducer from '../reducers/authReducer'
import ParkingReducer from './parkingReducer';

const rootReducer = combineReducers({
    authReducer: authReducer,
    parkingReducer: ParkingReducer
})

export default rootReducer;