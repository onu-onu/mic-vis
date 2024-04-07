import { Chart } from "./Chart";

window.onload = () => {

	const reloadBtn: HTMLButtonElement = <HTMLButtonElement>document.querySelector('#reload-btn');
	reloadBtn.addEventListener('click', () => {
		location.reload();
	});

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

	function checkMicConnection(dataArray: Uint8Array): boolean {
		dataArray.forEach(val => {
			console.log(val);
			if (val !== 0) return true;
		});
		return false;
	}

	const chart: Chart = new Chart();
	const audioContext = new AudioContext();

	navigator.mediaDevices.getUserMedia({ audio: true })
		.then(function (stream) {

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


			let micConnErrorCount = 0

			function draw() {

				analyserNode.getByteFrequencyData(dataArray);


				if (!checkMicConnection(dataArray)) {
					micConnErrorCount++;
					if (micConnErrorCount > 3) {
						location.reload();
					}
				}

				chart.draw(dataArray, bufferLength);

				requestAnimationFrame(draw)
			}


			draw();
		})
		.catch(function (err) {
			console.error('エラーが発生しました: ' + err);
		});
}

