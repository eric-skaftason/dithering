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
        return structuredClone(this.#imageData);
    }

    getPixelData_RGBA(x, y) {
        // data is a Uint8ClampedArray: [R, G, B, A, R, G, B, A, ...]

        const pixelStartIndex = (y * this.#imageData.data.width + x) * 4;
        
        return [
            this.#imageData[pixelStartIndex],
            this.#imageData[pixelStartIndex + 1],
            this.#imageData[pixelStartIndex + 2],
            this.#imageData[pixelStartIndex + 3]
        ];
    }

    getPixelData_lum(x, y) {
        const rgba = this.getPixelData_RGBA(x, y);
        const luminance = (rgba[0] + rgba[1] + rgba[2]) / 3;

        return [luminance];
    }

    getImageData_lum() {
        const imageData = this.getImageData();

        if (!imageData) return;

        // Iterate over each pixel
        for (let i = 0; i < imageData.data.length; i += 4) {
            // Iterate over [r, g, b], but skip [a] for each pixel
            let sum = 0;

            for (let j = 0; j < 3; j++) {
                sum += imageData.data[i + j];
            }

            const avg = Math.round(sum / 3);
            
            // Set the r, g, b values to the avg - chrominance
            imageData.data[i] = avg;
            imageData.data[i + 1] = avg;
            imageData.data[i + 2] = avg;
        }

        return imageData;
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
        this.displayGreyscale();
    }

    displayImage() {
        const imageData = this.#imageDataHelper.getImageData();
        if (!imageData) {
            setTimeout(() => {
                this.displayImage();
            }, 1000);
            return;
        }
        
        this.#canvas.width = imageData.width;
        this.#canvas.height = imageData.height;

        this.#ctx.putImageData(imageData, 0, 0);
    }
    
    displayGreyscale() {
        const imageData = this.#imageDataHelper.getImageData_lum();
        if (!imageData) {
            setTimeout(() => {
                this.displayGreyscale();
            }, 1000);
            return;
        }

        this.#canvas.width = imageData.width;
        this.#canvas.height = imageData.height;

        this.#ctx.putImageData(imageData, 0, 0);


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

