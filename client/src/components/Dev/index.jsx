import React, { useState } from 'react';
import axios from 'axios';

import { DefaultPlayer as Video } from 'react-html5video';

const Component = ({ match }) => {
    const magnet = match.params.magnet;
    
    const [filename, setFilename] = useState('');

	const _handleDownload = () => {
		axios.get(`/temp/add/${magnet}`).then(res => {
			setFilename(res.data.filename);
		});
    };

	return (
		<div>
			<button onClick={_handleDownload}>Download</button>
			{filename !== '' ? (
				<Video
					id='streaming'
					controls={[
						'PlayPause',
						'Seek',
						'Time',
						'Volume',
						'Fullscreen',
						'Captions'
					]}
					autoPlay={true}>
					<source
						src={`/temp/stream/${magnet}/${filename}`}
						type='video/mp4'
					/>
				</Video>
			) : null}
		</div>
	);
};

export default Component;
