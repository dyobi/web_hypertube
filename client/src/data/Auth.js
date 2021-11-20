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
        /api/token/
    parameter: 
        null
    result:
        status
    using at:
        App
*/
export const checkToken = (token, cb) => {
    const url = `/api/token`;
    const data = {
        token
    };

    Axios.get(url, { params: data })
        .then(res => {
            cb(res.data);
        })
        .catch(() => {
            cb(0);
        });
};

/*
    method: 
        POST
    url: 
        /api/auth
    parameter: 
        userName, password
    result:
        status:
            200: success
            411: invalid userName
            412: invalid password
        obj
    using at:
        Signin
*/
export const signin = (userName, password, cb) => {
    const url = `/api/auth/signin`;
    const data = {
        userName,
        password
    };

    Axios.post(url, data)
        .then(res => {
            cb(res.data);
        })
        .catch(() => {
            cb(0);
        });
};

/*
    method: 
        GET
    url: 
        /api/auth/userName/:userName
    parameter: 
        null
    result:
        status
    using at:
        Signup, UserSetting
*/
export const getUserName = (userName, cb) => {
    const url = `/api/auth/userName/${userName}`;

    Axios.get(url)
        .then(res => {
            cb(res.data);
        })
        .catch(() => {
            cb(0);
        });
};

/*
    method: 
        GET
    url: 
        /api/auth/email/:email
    parameter: 
        null
    result:
        status
    using at:
        Signup, Recovery
*/
export const getEmail = (email, cb) => {
    const url = `/api/auth/email/${email}`;

    Axios.get(url)
        .then(res => {
            cb(res.data);
        })
        .catch(() => {
            cb(0);
        });
};

/*
    method: 
        POST
    url: 
        /api/auth
    parameter: 
        userName, password, email, firstName, lastName
    result:
        status
    using at:
        Signup
*/
export const signup = (userName, password, email, firstName, lastName, cb) => {
    const url = `/api/auth/signup`;
    const data = {
        userName,
        password,
        email,
        firstName,
        lastName
    };

    Axios.post(url, data)
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
        /api/auth/recovery/:email
    parameter: 
        null
    result:
        status
    using at:
        Recovery
*/
export const recovery = (email, cb) => {
    const url = `/api/auth/recovery/${email}`;

    Axios.get(url)
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
        /api/auth/recovery/:uuid
    parameter: 
        password
    result:
        status
    using at:
        RecoveryCallback
*/
export const recoveryCallback = (uuid, password, cb) => {
    const url = `/api/auth/recovery`;
    const data = {
        uuid,
        password
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
        GET
    url: 
        /api/auth/social
    parameter: 
        userName, email, firstName, lastName, picture, socialType
    result:
        status
    using at:
        SocialSigninCallback
*/
export const oAuth = ({ userName, email, firstName, lastName, picture, socialType }, cb) => {
    const url = `/api/auth/social`;
    const data = {
        userName: `${userName}-${Math.floor(Math.random() * 100000)}`,
        email,
        firstName,
        lastName,
        picture,
        socialType
    };

    Axios.post(url, data)
        .then(res => {
            cb(res.data);
        })
        .catch(() => {
            cb({
                status: 400
            });
        });
};
