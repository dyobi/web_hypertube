import React, { useState, useEffect } from 'react';

import { useSelector } from 'react-redux';

import { apiSearch, apiSearchWithCast, apiSearchWithCrew, apiSearchWithCompany } from '../../data';

import Movie from '../Movie';

import './index.css';

const Component = ({ match }) => {
    const type = match.params.type;
    const query = match.params.query;
    const queryName = match.params.queryName;

    const [result, setResult] = useState({
        results: [],
        page: 1,
        total: 1
    });

    const ui = useSelector(state => state.ui);

    useEffect(() => {
        let isCancelled = false;

        let func;

        if (type === 'movie') {
            func = apiSearch;
        } else if (type === 'cast') {
            func = apiSearchWithCast;
        } else if (type === 'crew') {
            func = apiSearchWithCrew;
        } else if (type === 'company') {
            func = apiSearchWithCompany;
        }

        func(query, 1, ui.lang, res => {
            if (!isCancelled) {
                setResult({
                    results: res.results,
                    page: 1,
                    total:
                        type === 'cast' || type === 'crew' || type === 'company'
                            ? res.total_pages
                            : res.total
                });
                isCancelled = false;
            }
        });
        return () => {
            isCancelled = true;
        };
    }, [ui.lang, type, query, queryName]);

    let isWorking = false;

    const _handleScroll = e => {
        if (result.page < result.total) {
            if (
                !isWorking &&
                e.target.scrollTop / (e.target.scrollHeight - e.target.clientHeight) > 0.9
            ) {
                isWorking = true;

                let func;

                if (type === 'movie') {
                    func = apiSearch;
                } else if (type === 'cast') {
                    func = apiSearchWithCast;
                } else if (type === 'crew') {
                    func = apiSearchWithCrew;
                } else if (type === 'company') {
                    func = apiSearchWithCompany;
                }

                func(query, result.page + 1, ui.lang, res => {
                    setResult({
                        results: [...result.results, ...res.results],
                        page: res.page,
                        total:
                            type === 'cast' || type === 'crew' || type === 'company'
                                ? res.total_pages
                                : res.total
                    });
                    isWorking = false;
                });
            }
        }
    };

    document.title = `${queryName === undefined ? query : queryName} - HyperTube`;

    return (
        <div className='search' onScroll={_handleScroll}>
            <div className='search-result'>
                {ui.lang === 'en_US' ? 'SEARCH RESULT' : '검색결과'} : "
                {type === 'movie' ? query : queryName}"
            </div>
            {result.results.map((movie, index) => (
                <Movie movieData={movie} key={index} />
            ))}
        </div>
    );
};

export default Component;
