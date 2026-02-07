import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface UserData {
    id: string;
    name: string;
    emailVerified: boolean;
    email: string;
    image: string;
}

export interface authState {
    userData: null | UserData,
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
        login: (state, action: PayloadAction<UserData>) => {
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