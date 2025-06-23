import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface mapState {
    isLoaded: boolean;
    character: string;
}

const initialState: mapState = {
    isLoaded: false,
    character: "Male"
}

export const mapSlice = createSlice({
    name: 'map',
    initialState,
    reducers: {
        mapLoadingState: (state, action: PayloadAction<string>) => {
            state.isLoaded = true
            state.character = action.payload
        },
        mapDismantleState: (state) => {
            state.isLoaded = false
            state.character = "Male"
        },

    },
})


export const { mapDismantleState, mapLoadingState } = mapSlice.actions

export default mapSlice.reducer