import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface mapState {
    isLoaded: boolean;
    character: string;
    roomId: string;
}

const initialState: mapState = {
    isLoaded: false,
    character: "Male",
    roomId: ""
}

export const mapSlice = createSlice({
    name: 'map',
    initialState,
    reducers: {
        mapLoadingState: (state, action: PayloadAction<{ character: string; roomId: string }>) => {
            state.isLoaded = true
            state.character = action.payload.character
            state.roomId = action.payload.roomId
        },
        mapDismantleState: (state) => {
            state.isLoaded = false
            state.character = "Male"
            state.roomId = ""
        },

    },
})


export const { mapDismantleState, mapLoadingState } = mapSlice.actions

export default mapSlice.reducer