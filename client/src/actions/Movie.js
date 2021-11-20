export const movie_genres = value => {
    return {
        type: 'MOVIE_GENRES',
        payload: {
            genres: value
        }
    };
};

export const movie_histories = value => {
    return {
        type: 'MOVIE_HISTORIES',
        payload: {
            histories: value
        }
    };
};
