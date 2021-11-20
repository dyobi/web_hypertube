import { combineReducers } from 'redux';

import auth from './Auth';
import user from './User';
import ui from './UI';
import movie from './Movie';

const rootReducers = combineReducers({
    auth,
    user,
    ui,
    movie
});

export default rootReducers;
