const UPDATE_ROOMS = 'UPDATE_ROOMS'

const initialState = []

/* eslint-disable default-param-last */
export default (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_ROOMS: {
            console.log(action.rooms)
            return state.concat(action.rooms)
        }
        default:
            return state
    }
}

export function updateRooms(data) {
    return {type: UPDATE_ROOMS, rooms: data}
}

