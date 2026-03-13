class ImageDataHelper {
    #src;
    #canvas;
    #ctx;

    // includes metedata
    #imageData;

    constructor(src) {
        this.#src = src;

        this.#initCanvas();
    }

    #initCanvas() {
        const img = new Image();
        img.src = this.#src;

        this.#canvas = document.createElement('canvas');
        this.#ctx = this.#canvas.getContext('2d');

        img.onload = () => {
            this.#canvas.width = img.width;
            this.#canvas.height = img.height;

            this.#ctx.drawImage(img, 0, 0);

            this.#imageData = this.#ctx.getImageData(0, 0, img.width, img.height);
        };
    }

    getImageData() {
        return this.#imageData;
    }

    getPixelData_RGBA(x, y) {
        // data is a Uint8ClampedArray: [R, G, B, A, R, G, B, A, ...]
        
    }

    getPixelData_lum(x, y) {
        const rgba = this.getPixelData_RGBA(x, y);
        const luminance = (rgba[0] + rgba[1] + rgba[2]) / 3;

        return [luminance];
    }
}

class FilteredImage {
    #src;
    #canvas;
    #ctx;

    #imageDataHelper;

    constructor(src) {
        // Define source
        this.#src = src;

        // Initialise imageDataHelper
        this.#imageDataHelper = new ImageDataHelper(src);

        // Create canvas
        this.#canvas = document.createElement('canvas');
        this.#ctx = this.#canvas.getContext('2d');
        document.body.append(this.#canvas);

        // Render image
        setTimeout(() => {
            this.displayImage();
        }, 1000);
    }

    displayImage() {
        const imageData = this.#imageDataHelper.getImageData();
        
        this.#ctx.putImageData(imageData, 0, 0);

    }
    
    displayGreyscale() {
        
    }

    // black and white
    displayBW(threshold) {

    }



}


const img123 = new FilteredImage('../images/browser-gb45d4bd06_640.png');
img123.displayGreyscale();

// const canvas = document.createElement('canvas');
// for (let i = 0; i < 9; i++) {

// }

// const img = new ImageData('../images/browser-gb45d4bd06_640.png');
// console.log(img.getPixelData(5, 5));

