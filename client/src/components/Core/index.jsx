import React from 'react';

import { Switch, Redirect, Route } from 'react-router-dom';

import Feed from '../Feed';
import Search from '../Search';
import SearchNull from '../SearchNull';
import Detail from '../Detail';
import Streaming from '../Streaming';
import SignIn from '../SignIn';
import SocialSignInCallback from '../SocialSignInCallback';
import SignUp from '../SignUp';
import Recovery from '../Recovery';
import RecoveryCallback from '../RecoveryCallback';
import User from '../User';
import Dev from '../Dev';
import Error from '../Error';

const Component = () => {
    return (
        <Switch>
            <Redirect from='/' to='/feed/all/popularity' exact />
            <Route path='/feed/:genre/:filter' exact component={Feed} />
            <Route path='/search/:type' exact component={SearchNull} />
            <Route path='/search/:type/:query' exact component={Search} />
            <Route path='/search/:type/:query/:queryName' exact component={Search} />
            <Route path='/detail/:id' exact component={Detail} />
            <Route path='/streaming/:tmdbId/:imdbId/:magnet' exact component={Streaming} />
            <Route path='/auth/signin' exact component={SignIn} />
            <Route path='/auth/signin/:source' exact component={SocialSignInCallback} />
            <Route path='/auth/signup' exact component={SignUp} />
            <Route path='/auth/recovery' exact component={Recovery} />
            <Route path='/auth/recovery/:uuid' exact component={RecoveryCallback} />
            <Route path='/user/:userName' exact component={User} />
            <Route path='/dev/:magnet' exact component={Dev} />
            <Route component={Error} />
        </Switch>
    );
};

export default Component;
