import { Chart } from "./Chart";

window.onload = () => {
	function setMicNameHtml(stream: any) {
		const audioTracks = stream.getAudioTracks();
		if (audioTracks.length > 0) {
			const audioTrackSettings = audioTracks[0].getSettings();
			const activeMicrophoneId = audioTrackSettings.deviceId;

			navigator.mediaDevices.enumerateDevices()
				.then(function (devices) {
					devices.forEach(function (device) {
						if (device.kind === 'audioinput' && device.deviceId === activeMicrophoneId) {
							const micNameElem: HTMLElement = <HTMLElement>document.querySelector('#mic-name');
							micNameElem.textContent = device.label;
						}
					});
				})
				.catch(function (err) {
					console.error('デバイスの列挙中にエラーが発生しました:', err);
				});
		}
	}

	function checkMicConnection(dataArray: Uint8Array, flag: boolean): boolean {
		let tmp: number = flag ? 1 : 0; // TRUEなら1, FALSEなら0
		dataArray.forEach(val => tmp += val);
		return tmp !== 0;
	}

	
	const reloadBtn: HTMLButtonElement = <HTMLButtonElement>document.querySelector('#reload-btn');
	reloadBtn.addEventListener('click', () => {
		location.reload();
	});

	const connStateElem: HTMLElement = <HTMLElement>document.querySelector('#conn-state');

	const chart: Chart = new Chart();
	const audioContext = new AudioContext();

	navigator.mediaDevices.getUserMedia({ audio: true })
		.then(function (stream) {

			function draw() {
				analyserNode.getByteFrequencyData(dataArray);

				isMicConn = checkMicConnection(dataArray, isMicConn);
				console.log(isMicConn);
				connStateElem.style.backgroundColor = isMicConn ? '#00bf46': '#c90000';

				chart.draw(dataArray, bufferLength);
				requestAnimationFrame(draw)
			}

			setMicNameHtml(stream);

			// メディアストリームからオーディオソースノードを作成
			const micInput = audioContext.createMediaStreamSource(stream);

			// スペクトラム解析器ノードを作成
			const analyserNode = audioContext.createAnalyser();
			analyserNode.fftSize = 2048; // FFT サイズを指定

			// 入力を解析器に接続
			micInput.connect(analyserNode);

			// 解析器からデータを取得するためのバッファを作成
			const bufferLength = analyserNode.frequencyBinCount;
			const dataArray = new Uint8Array(bufferLength);

			let isMicConn: boolean = false;
			draw();
		})
		.catch(function (err) {
			console.error('エラーが発生しました: ' + err);
		});
}

