import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface authState {
    userData: null | object,
    isAuthenticated: boolean
}

const initialState: authState = {
    userData: null,
    isAuthenticated: false
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<object>) => {
            state.userData = action.payload
            state.isAuthenticated = true
        },
        logout: (state) => {
            state.userData = null
            state.isAuthenticated = false
        },

    },
})


export const { login, logout } = authSlice.actions

export default authSlice.reducer