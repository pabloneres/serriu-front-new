import {combineReducers} from 'redux'


import clinic from './clinic/Clinic.reducer'
import auth from './auth/Auth.reducer'
import dentist from './dentist/Dentist.reducer'

export default combineReducers({
    auth,
    clinic,
    dentist
})