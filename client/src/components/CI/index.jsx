import React from 'react';

import { Link } from 'react-router-dom';

import CI from '../../assets/images/ci.png';
import './index.css';

const Component = () => {
    return (
        <Link to='/'>
            <img className='ci-icon' src={CI} alt='hypertube' />
            <div className='ci-title'>HyperTube</div>
        </Link>
    );
};

export default Component;
