import { configureStore } from '@reduxjs/toolkit'
import authReducer from "./auth/authSlice"
import mapReducer from "./map/mapSlice"
import chatReducer from "./chat/chatSlice"

export const makeStore = () => {
    return configureStore({
        reducer: {
            auth: authReducer,
            map: mapReducer,
            chat: chatReducer
        },
    })
}


export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']