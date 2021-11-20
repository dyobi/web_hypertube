import React from 'react';

import { useSelector } from 'react-redux';

import GenreButton from '../GenreButton';
import SorterButton from '../SorterButton';

import './index.css';

const Component = ({ genre, filter, _handleFilter }) => {
    const ui = useSelector(state => state.ui);

    const genres = [
        {
            url: 'all',
            titleEN: 'ALL',
            titleKR: '모두보기'
        },
        {
            url: 'action',
            titleEN: 'ACTION',
            titleKR: '액션'
        },
        {
            url: 'adventure',
            titleEN: 'ADVENTURE',
            titleKR: '어드벤쳐'
        },
        {
            url: 'animation',
            titleEN: 'ANIMATION',
            titleKR: '애니메이션'
        },
        {
            url: 'comedy',
            titleEN: 'COMEDY',
            titleKR: '코미디'
        },
        {
            url: 'crime',
            titleEN: 'CRIME',
            titleKR: '범죄'
        },
        {
            url: 'documentary',
            titleEN: 'DOCUMENTARY',
            titleKR: '다큐멘터리'
        },
        {
            url: 'drama',
            titleEN: 'DRAMA',
            titleKR: '드라마'
        },
        {
            url: 'family',
            titleEN: 'FAMILY',
            titleKR: '가족'
        },
        {
            url: 'fantasy',
            titleEN: 'FANTASY',
            titleKR: '판타지'
        },
        {
            url: 'history',
            titleEN: 'HISTORY',
            titleKR: '역사'
        },
        {
            url: 'horror',
            titleEN: 'HORROR',
            titleKR: '공포'
        },
        {
            url: 'music',
            titleEN: 'MUSIC',
            titleKR: '음악'
        },
        {
            url: 'mystery',
            titleEN: 'MYSTERY',
            titleKR: '미스터리'
        },
        {
            url: 'romance',
            titleEN: 'ROMANCE',
            titleKR: '로맨스'
        },
        {
            url: 'sciencefiction',
            titleEN: 'SCIENCE FICTION',
            titleKR: '공상과학'
        },
        {
            url: 'tvmovie',
            titleEN: 'TV MOVIE',
            titleKR: 'TV 영화'
        },
        {
            url: 'thriller',
            titleEN: 'THRILLER',
            titleKR: '스릴러'
        },
        {
            url: 'war',
            titleEN: 'WAR',
            titleKR: '전쟁'
        },
        {
            url: 'western',
            titleEN: 'WESTERN',
            titleKR: '서부'
        }
    ];

    const sorters = [
        {
            url: 'popularity',
            titleEN: 'POPULARITY',
            titleKR: '인기도'
        },
        {
            url: 'rating',
            titleEN: 'RATING',
            titleKR: '평가'
        },
        {
            url: 'revenue',
            titleEN: 'REVENUE',
            titleKR: '수익'
        }
    ];

    const trends = [
        {
            url: 'trend_day',
            titleEN: 'TODAY',
            titleKR: '오늘의 트렌드'
        },
        {
            url: 'trend_week',
            titleEN: 'THIS WEEK',
            titleKR: '이주의 트렌드'
        }
    ];

    const upcoming = [
        {
            url: 'now_playing',
            titleEN: 'NOW PLAYING',
            titleKR: '현재상영작'
        },
        {
            url: 'upcoming',
            titleEN: 'UPCOMING',
            titleKR: '상영예정작'
        }
    ];

    return (
        <div className='filter'>
            <div className='filter-container'>
                <div className='filter-title'>{ui.lang === 'en_US' ? 'GENRE' : '장르별'}</div>
                <div className='filter-element-container'>
                    {genres.map((element, index) => (
                        <GenreButton
                            url={element.url}
                            titleEN={element.titleEN}
                            titleKR={element.titleKR}
                            genre={genre}
                            filter={filter}
                            key={index}
                        />
                    ))}
                </div>
                <div className='filter-title'>{ui.lang === 'en_US' ? 'SORT BY' : '정렬순'}</div>
                <div className='filter-element-container'>
                    {sorters.map((element, index) => (
                        <SorterButton
                            url={element.url}
                            titleEN={element.titleEN}
                            titleKR={element.titleKR}
                            genre={genre}
                            filter={filter}
                            key={index}
                        />
                    ))}
                </div>
                <div className='filter-division'></div>
                <div className='filter-title'>{ui.lang === 'en_US' ? 'TRENDS' : '트렌드'}</div>
                <div className='filter-element-container'>
                    {trends.map((element, index) => (
                        <SorterButton
                            url={element.url}
                            titleEN={element.titleEN}
                            titleKR={element.titleKR}
                            genre={genre}
                            filter={filter}
                            key={index}
                        />
                    ))}
                </div>
                <div className='filter-title'>
                    {ui.lang === 'en_US' ? 'NOW PLAYING & UPCOMING' : '상영작 및 상영예정작'}
                </div>
                <div className='filter-element-container'>
                    {upcoming.map((element, index) => (
                        <SorterButton
                            url={element.url}
                            titleEN={element.titleEN}
                            titleKR={element.titleKR}
                            genre={genre}
                            filter={filter}
                            key={index}
                        />
                    ))}
                </div>
                <button className='filter-confirm' onClick={_handleFilter}>
                    CONFIRM
                </button>
            </div>
        </div>
    );
};

export default Component;
