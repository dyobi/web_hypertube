const data = {
    token: '',
    isCheck: false
};

const reducer = (state = data, action) => {
    switch (action.type) {
        case 'AUTH_TOKEN':
            return Object.assign({}, state, {
                token: action.payload.token
            });
        case 'AUTH_ISCHECK':
            return Object.assign({}, state, {
                isCheck: action.payload.isCheck
            });
        default:
            return state;
    }
};

export default reducer;
