import Axios from 'axios';

export const getTorrents = (id, cb) => {
    let url = `/torrent/search/${id}`;

    Axios.get(url)
        .then(res => {
            cb(
                res.data.sort(function(a, b) {
                    if (a.title.match('1080') && b.title.match('720')) {
                        return 1;
                    } else if (a.title.match('720') && b.title.match('1080')) {
                        return -1;
                    }

                    return b.seeders - a.seeders;
                })
            );
        })
        .catch(() => {
            cb({
                status: 400
            });
        });
};

export const getTorrentSubtitles = (id, lang, cb) => {
    let url = `/torrent/subtitle/${id}/${lang}`;

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
