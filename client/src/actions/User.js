export const user_data = value => {
    return {
        type: 'USER_DATA',
        payload: {
            id: value.id,
            userName: value.userName,
            email: value.email,
            firstName: value.firstName,
            lastName: value.lastName,
            picture: value.picture,
            socialType: value.socialType
        }
    };
};

export const user_picture = value => {
    return {
        type: 'USER_PICTURE',
        payload: {
            picture: value.picture,
        }
    };
};
