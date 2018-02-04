//Author: Dakad

//Date: 2018-01-02
//Version: 0.1

/*====================================*/


function HProgressBar(progress = 0) {
    const canvas = _genCanvas();
    const context = canvas.getContext('2d');

    this.draw = (pctg) => {
        _drawToCanvas(pctg || progress);
        return context.getImageData(0, 0, canvas.width, canvas.height);
    };

    const _drawToCanvas = (percentage = 0) => {
        const endpos = _calcEndPos(percentage);

        context.imageSmoothingEnabled = false;
        context.clearRect(0, 0, canvas.width, canvas.height);

        context.strokeStyle = "lime";
        context.lineWidth = 2;
        context.strokeRect(0, 0, canvas.width, canvas.height);

        context.fillStyle = 'green';
        context.fillRect(0, 0, endpos.x, endpos.y);
    };

    function _genCanvas() {
        const cvs = document.createElement('canvas');

        cvs.style.cssText = "width:19px; height:6px; border:1px solid green";

        cvs.setAttribute('width', 19);
        cvs.setAttribute('height', 6);

        return cvs;
    };

    const _calcEndPos = (percentage = 0) => {
        return {
            x: parseInt(canvas.width * percentage),
            y: canvas.height
        };
    }
}