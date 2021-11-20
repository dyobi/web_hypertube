const data = {
    genres: [],
    histories: []
};

const reducer = (state = data, action) => {
    switch (action.type) {
        case 'MOVIE_GENRES':
            return Object.assign({}, state, {
                genres: action.payload.genres
            });
        case 'MOVIE_HISTORIES':
            return Object.assign({}, state, {
                histories: action.payload.histories
            });
        default:
            return state;
    }
};

export default reducer;
