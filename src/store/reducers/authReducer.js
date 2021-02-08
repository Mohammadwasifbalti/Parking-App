const initialState = {
    auth: null,
    user: null
}
const authReducer = (state = initialState, action) =>
{
    switch(action.type)
    {
        case 'auth':
            return{
                ...state,
                auth: action.payload
            }
        case 'user':
            return{
                ...state,
                user: action.payload
            }
        default :
        return{
            ...state
        }
    }
}
export default authReducer;