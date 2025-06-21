import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface mapState {
    isLoaded: boolean
}

const initialState: mapState = {
    isLoaded: false
}

export const mapSlice = createSlice({
    name: 'map',
    initialState,
    reducers: {
        mapLoadingState: (state) => {
            state.isLoaded = true
        },
        mapDismantleState: (state) => {
            state.isLoaded = false
        },

    },
})


export const { mapDismantleState, mapLoadingState } = mapSlice.actions

export default mapSlice.reducer