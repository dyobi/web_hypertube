export const auth_token = value => {
    return {
        type: 'AUTH_TOKEN',
        payload: {
            token: value
        }
    };
};

export const auth_isCheck = value => {
    return {
        type: 'AUTH_ISCHECK',
        payload: {
            isCheck: value
        }
    };
};