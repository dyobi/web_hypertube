/*
    Response = {
        status: number
            200: success
            400: failure
            401: invalid token
        obj: object(return value)
        list: list(return value)
    }
*/

import Axios from 'axios';

/*
    method: 
        GET
    url: 
        /api/user/token
    parameter: 
        null
    result:
        status
        obj
    using at:
        User
*/
export const getUserByToken = (token, cb) => {
    const url = `/api/user/token`;
    const data = {
        token
    };

    Axios.get(url, { params: data })
        .then(res => {
            cb(res.data);
        })
        .catch(() => {
            cb({
                status: 400
            });
        });
};

/*
    method: 
        GET
    url: 
        /api/user/:userName
    parameter: 
        token
    result:
        status
        obj
    using at:
        User
*/
export const getUserByUserName = (token, userName, cb) => {
    const url = `/api/user/${userName}`;
    const data = {
        token
    };

    Axios.get(url, { params: data })
        .then(res => {
            cb(res.data);
        })
        .catch(() => {
            cb({
                status: 400
            });
        });
};

/*
    method: 
        PUT
    url: 
        /api/user
    parameter: 
        token, userName, password, email, firstName, lastName
    result:
        status
    using at:
        UserSetting
*/
export const putUser = (token, userName, password, email, firstName, lastName, cb) => {
    const url = `/api/user`;
    const data = {
        token,
        userName,
        password,
        email,
        firstName,
        lastName
    };

    Axios.put(url, data)
        .then(res => {
            cb(res.data);
        })
        .catch(() => {
            cb({
                status: 400
            });
        });
};

/*
    method: 
        PUT
    url: 
        /api/user/picture
    parameter: 
        formData(token, file)
    result:
        status
    using at:
        UserSetting
*/
export const putUserPicture = (formData, cb) => {
    const url = `/api/user/picture`;

    Axios.put(url, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
        .then(res => {
            cb(res.data);
        })
        .catch(() => {
            cb({
                status: 400
            });
        });
};

/*
    method: 
        DELETE
    url: 
        /api/user
    parameter: 
        null
    result:
        status
    using at:
        User
*/
export const deleteUser = (token, cb) => {
    const url = `/api/user`;
    const data = {
        token
    };

    Axios.delete(url, { params: data })
        .then(res => {
            cb(res.data);
        })
        .catch(() => {
            cb({
                status: 400
            });
        });
};
