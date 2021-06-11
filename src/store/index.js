import { createStore } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import rootReducer from './modules/rootReducer'

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['auth', 'clinic', 'dentist']
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

let store = createStore(persistedReducer)

export const persistor = persistStore(store);

export default store;