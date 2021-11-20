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
        /api/histories/:userName
    parameter: 
        token
    result:
        status
        list
    using at:
        UserRecentWatching
*/
export const getHistories = (token, userName, cb) => {
    const url = `/api/histories/${userName}`;
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
        POST
    url: 
        /api/history
    parameter: 
        token, movieId, current, duration
    result:
        status
*/
export const postHistory = (token, movieId, current, duration, cb) => {
    const url = `/api/history`;
    const data = {
        token,
        movieId,
        current,
        duration
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
