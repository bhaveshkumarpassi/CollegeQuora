const INITIAL_STATE = {
    message:null,
    err:null
}
export const contact = (state=INITIAL_STATE,action)=>{
    switch(action.type){
        case 'CONTACT_US':
            return{...state, message:action.payload, err:null}
        case 'FORM_FAILED':
            return {...state, isSignedIn:false, userId:null, token:null, err:action.payload.error}
        default:
            return state
    }
}