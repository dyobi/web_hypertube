import React, { useState, useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { user_picture } from '../../actions';

import UserMenu from '../UserMenu';
import UserRecentWatching from '../UserRecentWatching';
import UserComments from '../UserComments';
import UserSetting from '../UserSetting';

import { getUserByUserName, putUserPicture } from '../../data';

import { session, alert } from '../../util';

import FeatherIcon from 'feather-icons-react';
import user_default from '../../assets/images/user_default.png';
import './index.css';

const Component = ({ match }) => {
    const userName = match.params.userName;

    const [userData, setUserData] = useState({
        id: -1,
        userName: '',
        firstName: '',
        lastName: '',
        picture: '',
        socialType: ''
    });
    const [nav, setNav] = useState(0);
    const [isDoneSearch, setIsDoneSearch] = useState(false);

    const auth = useSelector(state => state.auth);
    const user = useSelector(state => state.user);
    const ui = useSelector(state => state.ui);
    const dispatch = useDispatch();

    useEffect(() => {
        let isCancelled = false;

        if (auth.isCheck && auth.token === '') {
            alert(
                'message',
                ui.lang === 'en_US'
                    ? 'This feature requires SignIn first.'
                    : '로그인이 필요한 서비스입니다.',
                () => window.open('/auth/signin', '_self'),
                null
            );
        }

        if (auth.token !== '') {
            getUserByUserName(auth.token, userName, res => {
                if (!isCancelled) {
                    if (session(dispatch, res)) {
                        setUserData(res.obj);
                        setIsDoneSearch(true);
                    }
                }
            });
        }

        return () => {
            isCancelled = true;
        };
    }, [dispatch, auth.token, auth.isCheck, userName, ui.lang]);

    const _handleInitChangePicture = () => {
        if (nav === 2) {
            document.getElementById('user-picture-upload').click();
        }
    };

    const _handleChangePicture = () => {
        let input = document.getElementById('user-picture-upload');

        let extension = input.value.split('.')[input.value.split('.').length - 1];
        if (extension === 'jpg' || extension === 'jpeg' || extension === 'png') {
            let formData = new FormData();
            formData.append('token', auth.token);
            formData.append('picture', input.files[0]);

            putUserPicture(formData, res => {
                if (session(dispatch, res)) {
                    setUserData({
                        id: userData.id,
                        userName: userData.userName,
                        email: userData.email,
                        firstName: userData.firstName,
                        lastName: userData.lastName,
                        picture: res.obj,
                        socialType: userData.socialType
                    });
                    dispatch(
                        user_picture({
                            picture: res.obj
                        })
                    );
                    alert('message', ui.lang === 'en_US' ? 'Done!' : '등록완료!', null, null);
                } else {
                    alert(
                        'message',
                        ui.lang === 'en_US'
                            ? 'Something went wrong :('
                            : '알 수 없는 오류가 발생했습니다 :(',
                        null,
                        null
                    );
                }
                input.value = '';
            });
        } else {
            input.value = '';
            alert(
                'message',
                ui.lang === 'en_US'
                    ? 'Extension of image can be only .jpg, .jpeg, .png!'
                    : '확장자가 .jpg, .jpeg, .png인 이미지만 업로드할 수 있습니다!',
                null,
                null
            );
        }
    };

    const menus = userData.userName === user.userName ? [0, 1, 2] : [0, 1];

    if (user.userName !== '') document.title = `${user.userName} - HyperTube`;

    return (
        <div className='user'>
            {userData.id === -1 ? (
                isDoneSearch ? (
                    ui.lang === 'en_US' ? (
                        "We can't find any information of this account"
                    ) : (
                        '회원정보를 찾을 수 없습니다.'
                    )
                ) : ui.lang === 'en_US' ? (
                    'We are looking for this account information'
                ) : (
                    '회원정보를 검색 중입니다.'
                )
            ) : (
                <div className='user-container'>
                    <div className='user-info'>
                        <div
                            className='user-info-picture'
                            style={{
                                backgroundImage:
                                    userData.picture !== null &&
                                    userData.picture !== undefined &&
                                    userData.picture !== ''
                                        ? `url('${
                                              userData.picture.match('SERVER/')
                                                  ? `/api/user/picture/${userData.picture.replace(
                                                        'SERVER/',
                                                        ''
                                                    )}`
                                                  : userData.picture
                                          }')`
                                        : `url('${user_default}')`
                            }}
                        >
                            <FeatherIcon
                                className={
                                    nav === 2
                                        ? 'user-info-picture-update-active'
                                        : 'user-info-picture-update'
                                }
                                icon='upload'
                                onClick={_handleInitChangePicture}
                            />
                            <input
                                id='user-picture-upload'
                                type='file'
                                style={{ display: 'none' }}
                                onChange={_handleChangePicture}
                            />
                        </div>
                        <div className='user-info-basic'>
                            <div className='user-info-userName'>@{userData.userName}</div>
                            <div className='user-info-fullName'>
                                {userData.firstName} {userData.lastName}
                            </div>
                        </div>
                    </div>
                    <div className='user-content-container'>
                        <div className='user-content-header'>
                            {menus.map((menu, index) => (
                                <UserMenu index={menu} nav={nav} setNav={setNav} key={index} />
                            ))}
                        </div>
                        <div className='user-content-body'>
                            {nav === 0 ? <UserRecentWatching userName={userData.userName} /> : null}
                            {nav === 1 ? <UserComments userData={userData} /> : null}
                            {nav === 2 ? (
                                <UserSetting userData={userData} setUserData={setUserData} />
                            ) : null}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Component;
