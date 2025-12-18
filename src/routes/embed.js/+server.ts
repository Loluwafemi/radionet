import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const freq = url.searchParams.get('freq') || '98.0';
	const autoplay = url.searchParams.get('autoplay') === 'true';
	const origin = url.origin;
	
	const script = `
(function() {
	const script = document.currentScript;
	const container = document.createElement('div');
	container.style.cssText = 'width: 100%; max-width: 400px; margin: 0 auto;';
	
	container.innerHTML = \`
		<div style="
			background: rgba(0, 0, 0, 0.3);
			backdrop-filter: blur(10px);
			-webkit-backdrop-filter: blur(10px);
			border: 1px solid rgba(255, 255, 255, 0.1);
			box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
			border-radius: 24px;
			padding: 24px;
			font-family: system-ui, -apple-system, sans-serif;
			color: white;
		">
			<div style="text-align: center; margin-bottom: 16px;">
				<div style="font-size: 32px; font-weight: bold; color: #ff6666;" id="radio-freq">${freq}</div>
				<div style="font-size: 12px; color: #aaa;">FM MHz</div>
			</div>
			
			<div style="display: flex; justify-content: center; gap: 12px; margin-bottom: 16px;">
				<button id="radio-play" style="
					background: rgba(255, 255, 255, 0.1);
					border: 1px solid rgba(255, 255, 255, 0.18);
					border-radius: 50%;
					width: 56px;
					height: 56px;
					cursor: pointer;
					font-size: 24px;
					display: flex;
					align-items: center;
					justify-content: center;
				">▶️</button>
			</div>
			
			<input type="range" id="radio-volume" min="0" max="100" value="70" style="
				width: 100%;
				height: 8px;
				border-radius: 4px;
				background: rgba(255, 255, 255, 0.1);
				outline: none;
				cursor: pointer;
			">
			
			<audio id="radio-audio" preload="none" crossorigin="anonymous"></audio>
			
			<div style="text-align: center; margin-top: 16px; font-size: 11px; color: #666;">
				Powered by <a href="${origin}" style="color: #ff6666; text-decoration: none;">Radio Player</a>
			</div>
		</div>
	\`;
	
	script.parentNode.insertBefore(container, script.nextSibling);
	
	// Initialize player
	const audio = container.querySelector('#radio-audio');
	const playBtn = container.querySelector('#radio-play');
	const volumeSlider = container.querySelector('#radio-volume');
	const freqDisplay = container.querySelector('#radio-freq');
	
	let isPlaying = false;
	let currentFreq = ${freq};
	
	audio.src = \`https://stream.example.com/fm/\${currentFreq.toFixed(1)}\`;
	audio.volume = 0.7;
	
	playBtn.addEventListener('click', () => {
		if (isPlaying) {
			audio.pause();
			playBtn.textContent = '▶️';
		} else {
			audio.play();
			playBtn.textContent = '⏸';
		}
		isPlaying = !isPlaying;
	});
	
	volumeSlider.addEventListener('input', (e) => {
		audio.volume = e.target.value / 100;
	});
	
	// Autoplay if requested
	if (${autoplay}) {
		audio.play().then(() => {
			playBtn.textContent = '⏸';
			isPlaying = true;
		}).catch(() => {
			console.log('Autoplay prevented by browser');
		});
	}
})();
	`.trim();
	
	return new Response(script, {
		headers: {
			'Content-Type': 'application/javascript',
			'Cache-Control': 'public, max-age=3600'
		}
	});
};