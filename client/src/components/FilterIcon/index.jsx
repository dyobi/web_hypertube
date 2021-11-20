import React from 'react';

import './index.css';

const Component = ({ genre, filter, _handleFilter }) => {
    return (
        <div className='filterIcon' onClick={_handleFilter}>
            / HyperTube /{' '}
            {filter === 'trend_day' ||
            filter === 'trend_week' ||
            filter === 'now_playing' ||
            filter === 'upcoming'
                ? filter.toUpperCase()
                : `${genre.toUpperCase()} / ${filter.toUpperCase()}`}
        </div>
    );
};

export default Component;
