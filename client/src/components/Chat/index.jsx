import React, { useState, useEffect } from 'react';

import { useSelector } from 'react-redux';

import io from 'socket.io-client';
import { SOCKET_URL } from '../../constants/url';

import ScrollToBottom from 'react-scroll-to-bottom';

import FeatherIcon from 'feather-icons-react';

import './index.css';

let socket;

const Component = ({ tmdbId }) => {
    const [messages, setMessages] = useState([]);
    const [isOpenChat, setIsOpenChat] = useState(false);

    const user = useSelector(state => state.user);

    useEffect(() => {
        if (user.userName !== '') {
            socket = io(SOCKET_URL);

            socket.emit('join', { userName: user.userName, movieRoom: tmdbId }, () => {});
        }
    }, [tmdbId, user.userName]);

    useEffect(() => {
        if (user.userName !== '') {
            socket.on('message', message => {
                setMessages(messages => [...messages, message]);
            });

            return () => {
                socket.emit('disconnect');
                socket.off();
            };
        }
    }, [messages, user.userName]);

    const _handleSendMessage = e => {
        e.preventDefault();

        const message = document.chat.message.value;
        if (message) {
            socket.emit('sendMessage', message, () => {
                document.chat.message.value = '';
            });
        }
    };

    const _handleOpenToggle = () => {
        setIsOpenChat(isOpenChat => !isOpenChat);
    };

    return (
        <div className={isOpenChat ? 'chat-active' : 'chat'}>
            <div className='chat-toggle-container'>
                <FeatherIcon
                    icon={isOpenChat ? 'chevron-down' : 'chevron-up'}
                    className='chat-toggle'
                    size='1rem'
                    onClick={_handleOpenToggle}
                />
            </div>
            <div className='chat-content-container'>
                <ScrollToBottom className='chat-message-container'>
                    {messages.map((message, index) => (
                        <div className='chat-message' key={index}>
                            <div className='chat-message-name'>
                                {message.userName.toUpperCase()}
                            </div>
                            <div className='chat-message-message'>{message.text}</div>
                        </div>
                    ))}
                </ScrollToBottom>
                <form name='chat' onSubmit={_handleSendMessage} autoComplete='off'>
                    <input
                        className='chat-input'
                        name='message'
                        placeholder='Message ...'
                        autoComplete='off'
                    />
                    <button className='chat-button' type='submit' />
                </form>
            </div>
        </div>
    );
};

export default Component;
