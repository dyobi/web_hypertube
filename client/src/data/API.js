import Axios from 'axios';
import { TMDB_ID, OMDB_ID } from '../constants/api';

export const apiGenres = (lang, cb) => {
    let url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${TMDB_ID}&language=${lang}`;

    Axios.get(url)
        .then(res => {
            cb(res.data.genres);
        })
        .catch(() => {
            cb(null);
        });
};

export const apiMovies = (genre, filter, page, lang, cb) => {
    let url = `https://api.themoviedb.org/4/discover/movie?api_key=${TMDB_ID}&page=${page}&language=${
        lang === 'en_US' ? 'en-US' : 'ko-KR'
    }`;

    if (genre === 'action') url += '&with_genres=28';
    else if (genre === 'adventure') url += '&with_genres=12';
    else if (genre === 'animation') url += '&with_genres=16';
    else if (genre === 'comedy') url += '&with_genres=35';
    else if (genre === 'crime') url += '&with_genres=80';
    else if (genre === 'documentary') url += '&with_genres=99';
    else if (genre === 'drama') url += '&with_genres=18';
    else if (genre === 'family') url += '&with_genres=10751';
    else if (genre === 'fantasy') url += '&with_genres=14';
    else if (genre === 'history') url += '&with_genres=36';
    else if (genre === 'horror') url += '&with_genres=27';
    else if (genre === 'music') url += '&with_genres=10402';
    else if (genre === 'mystery') url += '&with_genres=9648';
    else if (genre === 'romance') url += '&with_genres=10749';
    else if (genre === 'sciencefiction') url += '&with_genres=878';
    else if (genre === 'tvmovie') url += '&with_genres=10770';
    else if (genre === 'thriller') url += '&with_genres=53';
    else if (genre === 'war') url += '&with_genres=10752';
    else if (genre === 'western') url += '&with_genres=37';

    if (filter === 'popularity') url += '&sort_by=popularity.desc';
    else if (filter === 'rating') url += '&sort_by=vote_average.desc';
    else if (filter === 'revenue') url += '&sort_by=revenue.desc';
    else if (filter === 'trend_day')
        url = `https://api.themoviedb.org/3/trending/movie/day?api_key=${TMDB_ID}&page=${page}&language=${
            lang === 'en_US' ? 'en-US' : 'ko-KR'
        }`;
    else if (filter === 'trend_week')
        url = `https://api.themoviedb.org/3/trending/movie/week?api_key=${TMDB_ID}&page=${page}&language=${
            lang === 'en_US' ? 'en-US' : 'ko-KR'
        }`;
    else if (filter === 'now_playing')
        url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${TMDB_ID}&page=${page}&language=${
            lang === 'en_US' ? 'en-US' : 'ko-KR'
        }`;
    else if (filter === 'upcoming')
        url = `https://api.themoviedb.org/3/movie/upcoming?api_key=${TMDB_ID}&page=${page}&region=US&language=${
            lang === 'en_US' ? 'en-US' : 'ko-KR'
        }`;

    Axios.get(url)
        .then(res => {
            cb(res.data.results);
        })
        .catch(() => {
            cb(null);
        });
};

export const apiMovie = (id, lang, cb) => {
    let url = `https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_ID}&language=${lang}`;

    Axios.get(url)
        .then(res => {
            cb(res.data);
        })
        .catch(() => {
            cb(null);
        });
};

export const apiMovieFromOMDB = (id, cb) => {
    let url = `https://www.omdbapi.com/?apikey=${OMDB_ID}&i=${id}`;

    Axios.get(url)
        .then(res => {
            cb(res.data);
        })
        .catch(() => {
            cb(null);
        });
}

export const apiMovieDetail = (id, lang, cb) => {
    let url = `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${TMDB_ID}&language=${
        lang === 'en_US' ? 'en-US' : 'ko-KR'
    }`;

    Axios.get(url)
        .then(res => {
            cb(res.data);
        })
        .catch(() => {
            cb(null);
        });
};

export const apiSimilarMovies = (id, lang, cb) => {
    let url = `https://api.themoviedb.org/3/movie/${id}/similar?api_key=${TMDB_ID}&language=${
        lang === 'en_US' ? 'en-US' : 'ko-KR'
    }`;

    Axios.get(url)
        .then(res => {
            cb(res.data.results);
        })
        .catch(() => {
            cb(null);
        });
};

export const apiRecommendationMovies = (id, lang, cb) => {
    let url = `https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=${TMDB_ID}&language=${
        lang === 'en_US' ? 'en-US' : 'ko-KR'
    }`;

    Axios.get(url)
        .then(res => {
            cb(res.data.results);
        })
        .catch(() => {
            cb(null);
        });
};

export const apiSearch = (query, page, lang, cb) => {
    let url = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_ID}&query=${query}&page=${page}&language=${
        lang === 'en_US' ? 'en-US' : 'ko-KR'
    }`;

    Axios.get(url)
        .then(res => {
            cb({
                results: res.data.results,
                page: res.data.page,
                total: res.data.total_pages
            });
        })
        .catch(() => {
            cb(null);
        });
};

export const apiSearchWithCast = (id, page, lang, cb) => {
    let url = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_ID}&with_cast=${id}&page=${page}&language=${
        lang === 'en_US' ? 'en-US' : 'ko-KR'
    }`;

    Axios.get(url)
        .then(res => {
            cb(res.data);
        })
        .catch(() => {
            cb(null);
        });
};

export const apiSearchWithCrew = (id, page, lang, cb) => {
    let url = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_ID}&with_crew=${id}&page=${page}&language=${
        lang === 'en_US' ? 'en-US' : 'ko-KR'
    }`;

    Axios.get(url)
        .then(res => {
            cb(res.data);
        })
        .catch(() => {
            cb(null);
        });
};

export const apiSearchWithCompany = (id, page, lang, cb) => {
    let url = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_ID}&with_companies=${id}&page=${page}&language=${
        lang === 'en_US' ? 'en-US' : 'ko-KR'
    }`;

    Axios.get(url)
        .then(res => {
            cb(res.data);
        })
        .catch(() => {
            cb(null);
        });
};
