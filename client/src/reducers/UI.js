const data = {
    lang: 'en_US'
};

const reducer = (state = data, action) => {
    switch (action.type) {
        case 'UI_LANG':
            return Object.assign({}, state, {
                lang: action.payload.lang
            });
        default:
            return state;
    }
};

export default reducer;
