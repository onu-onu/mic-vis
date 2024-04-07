import { Chart } from "./Chart";

window.onload = () => {

	const reloadBtn: HTMLButtonElement = <HTMLButtonElement>document.querySelector('#reload-btn');
	reloadBtn.addEventListener('click', () => {
		console.log('click')
		location.reload();
	});


	const chart: Chart = new Chart();
	const audioContext = new AudioContext();

	navigator.mediaDevices.getUserMedia({ audio: true })
		.then(function (stream) {
			

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


			function draw() {
				
				analyserNode.getByteFrequencyData(dataArray);
				chart.draw(dataArray, bufferLength);

				requestAnimationFrame(draw)
			}


			draw();
		})
		.catch(function (err) {
			console.error('エラーが発生しました: ' + err);
		});
}

