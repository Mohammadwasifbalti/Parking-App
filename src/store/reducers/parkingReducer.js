const initState = {
    parkingPlace: false,
    parkingSlots: false,
    Bookings: false,
    temp: false,
    Feedback: false
}

const ParkingReducer = (state = initState, action) =>
{
    switch(action.type)
    {
        case 'parkingPlace':
            console.log(action.payload)
            return{
                ...state,
                parkingPlace : action.payload
            }
        case 'Slots':
            return{
                ...state,
                parkingSlots: action.payload,
                temp: Date.now()
            }
        case 'Bookings':
            return{
                ...state,
                temp: Date.now(),
                Bookings: action.payload,
            }
        case 'Feedback':
            console.log('feedback added')
            return{
                ...state,
                Feedback: action.payload
            }
        case 'temp':
            console.log('temp')
            return{
                ...state,
                temp: Date.now()
            }
        default: 
            return{
                ...state
            }
    }
}
export default ParkingReducer;