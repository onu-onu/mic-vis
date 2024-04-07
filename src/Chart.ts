export class Chart {
    private ctx: CanvasRenderingContext2D;
    private width = 600;
    private height = 200;

    constructor() {
        const cvs: HTMLCanvasElement = <HTMLCanvasElement>document.querySelector('#cvs');
        this.ctx = <CanvasRenderingContext2D>cvs.getContext('2d');
        const dpr = window.devicePixelRatio;

        cvs.width = this.width * dpr;
        cvs.height = this.height * dpr;
        this.ctx.scale(dpr, dpr);
        cvs.style.width = this.width + 'px';
        cvs.style.height = this.height + 'px';
        cvs.style.display = 'block';
    }


    public draw(dataArray: Uint8Array, bufferLength: number) {
        const volumeMax = 30;
        const freqList = this.normalization(dataArray, bufferLength);
        const volume = this.getVolume(dataArray, bufferLength);

        this.ctx.clearRect(0, 0, this.width, this.height);

        this.ctx.fillStyle = '#ddd';
        this.drawSpectrum(freqList);

        // volume barの描画
        this.ctx.save();
        this.ctx.translate(0, 80);
        this.ctx.fillStyle = '#444';
        this.drawVolumeBar(volumeMax);
        this.ctx.fillStyle = '#ddd';
        this.drawVolumeBar(volume);

        this.ctx.restore();
    }

    private normalization(dataArray: Uint8Array, bufferLength: number) {
        const freqList: number[] = [];
        const d = 10;
        for (let i = 0; i < dataArray.length; i += d) {
            let tmp = 0;
            for (let j = i; j < i + d; j++) {
                tmp += dataArray[j]
            }
            freqList.push(tmp / d);
        }
        return freqList;
    }

    private getVolume(dataArray: Uint8Array, bufferLength: number) {
        // すべての周波数成分の平均を計算
        const sum = dataArray.reduce((acc, val) => acc + val, 0);
        return sum / bufferLength / 255 * 30;
    }


    private drawVolumeBar(volume: number) {
        let y: number = 0;
        let w: number = 18;
        let h: number = 30;
        let margin = { top: 0, right: 2, bottom: 0, left: 0 };

        for (let i = 0; i < volume; i++) {
            let x: number = i * (w + margin.right);
            this.ctx.beginPath();
            this.ctx.roundRect(x, y, w, h, [2]);
            this.ctx.fill();
        }
    }

    private drawSpectrum(dataArray: number[]) {
        let maxH: number = 60;
        let w: number = 10;
        let margin = { top: 0, right: 2, bottom: 2, left: 0 };

        dataArray.forEach((val, i) => {
            let w0: number = w;
            let h0: number = val / 255 * maxH;
            let x0: number = i * (w + margin.right);
            let y0: number = maxH - h0;

            this.ctx.beginPath();
            this.ctx.roundRect(x0, y0, w0, h0, [1]);
            this.ctx.fill();

            let w1: number = w;
            let h1: number = w;
            let x1: number = x0;
            let y1: number = maxH + margin.bottom;

            this.ctx.beginPath();
            this.ctx.roundRect(x1, y1, w1, h1, [1]);
            this.ctx.fill();
        });
    }
}