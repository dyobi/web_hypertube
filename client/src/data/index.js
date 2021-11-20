import {
    apiGenres,
    apiMovies,
    apiMovie,
    apiMovieFromOMDB,
    apiMovieDetail,
    apiSimilarMovies,
    apiRecommendationMovies,
    apiSearch,
    apiSearchWithCast,
    apiSearchWithCrew,
    apiSearchWithCompany
} from './API';

import {
    checkToken,
    signin,
    getUserName,
    getEmail,
    signup,
    recovery,
    recoveryCallback,
    oAuth
} from './Auth';

import {
    requestGoogleCode,
    requestGoogleProfile,
    requestFacebookCode,
    requestFacebookProfile,
    request42Code,
    request42Profile
} from './oAuth';

import { getUserByToken, getUserByUserName, putUser, putUserPicture, deleteUser } from './User';

import { getHistories, postHistory } from './History';

import { getCommentsByMovieId, getCommentsByUserId, postComment, deleteComment } from './Comment';

import { getTorrents, getTorrentSubtitles } from './Torrent';

export {
    apiGenres,
    apiMovies,
    apiMovie,
    apiMovieFromOMDB,
    apiMovieDetail,
    apiSimilarMovies,
    apiRecommendationMovies,
    apiSearch,
    apiSearchWithCast,
    apiSearchWithCrew,
    apiSearchWithCompany,
    checkToken,
    signin,
    getUserName,
    getEmail,
    signup,
    oAuth,
    recovery,
    recoveryCallback,
    requestGoogleCode,
    requestGoogleProfile,
    requestFacebookCode,
    requestFacebookProfile,
    request42Code,
    request42Profile,
    getUserByToken,
    getUserByUserName,
    putUser,
    putUserPicture,
    deleteUser,
    getHistories,
    postHistory,
    getCommentsByMovieId,
    getCommentsByUserId,
    postComment,
    deleteComment,
    getTorrents,
    getTorrentSubtitles
};
