import { confirmAlert } from 'react-confirm-alert';

export const alert = (type, message, cb1, cb2) => {
    if (type === 'message') {
        confirmAlert({
            message: message,
            buttons: [
                {
                    label: 'Okay',
                    onClick: cb1
                }
            ]
        });
    } else if (type === 'question') {
        confirmAlert({
            message: message,
            buttons: [
                {
                    label: 'Yes',
                    onClick: cb1
                },
                {
                    label: 'No',
                    onClick: cb2
                }
            ]
        });
    } else {
        confirmAlert({
            message: 'Message Error',
            buttons: [
                {
                    label: 'Yes'
                }
            ]
        });
    }
};
