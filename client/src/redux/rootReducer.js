const initialState = {
    token:'',
    refreshToken:''
}

export default function(state = initialState, action){
    switch(action.type){
        case 'SET_ACCESS_TOKEN':{
            return {
                ...state,
                token:action.payload
            }
        }
        case 'SET_REFRESH_TOKEN':{
            return {
                ...state,
                refreshToken:action.payload
            }
        }
        default: return state;
    }
    
}