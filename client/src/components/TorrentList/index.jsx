import React, { useState, useEffect } from 'react';

import { useSelector } from 'react-redux';

import Torrent from '../Torrent';

import { getTorrents } from '../../data';

import './index.css';

const Component = ({ id }) => {
    const [torrentList, setTorrentList] = useState([]);
    const [isDoneSearch, setIsDoneSearch] = useState(false);

    const ui = useSelector(state => state.ui);

    useEffect(() => {
        let isCancelled = false;

        getTorrents(id, res => {
            if (!isCancelled) {
                if (res !== null && res.length !== undefined && res.length > 0) {
                    setTorrentList(res);
                }
                setIsDoneSearch(true);
            }
        });
        return () => {
            isCancelled = true;
        };
    }, [id, setIsDoneSearch]);

    return (
        <div className='torrentList'>
            {torrentList.length !== 0
                ? torrentList.map((torrent, index) => <Torrent torrent={torrent} key={index} />)
                : null}
            {torrentList.length === 0 && isDoneSearch
                ? ui.lang === 'en_US'
                    ? 'We cannot find out any torrent file :( Please try again!'
                    : '토렌트 파일을 찾을 수 없습니다 :( 다시 시도해 주세요!'
                : null}
            {torrentList.length === 0 && !isDoneSearch
                ? ui.lang === 'en_US'
                    ? 'We are looking for torrent file!'
                    : '토렌트 파일을 검색 중입니다.'
                : null}
        </div>
    );
};

export default Component;
