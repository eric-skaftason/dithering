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

    getImageData_BW(threshold = 128) {
        const imageData = this.getImageData_lum();

        if (!imageData) return;

        // Iterate over each pixel
        for (let i = 0; i < imageData.data.length; i += 4) {
            // Since RGB values for greyscale images are equal, the R value can be used as the chrominance value
            let chrominance = imageData.data[i];

            chrominance >= threshold ? chrominance = 255 : chrominance = 0;
            
            // Set the r, g, b values to the avg - chrominance
            imageData.data[i] = chrominance;
            imageData.data[i + 1] = chrominance;
            imageData.data[i + 2] = chrominance;
        }

        return imageData;
    }

    // Random dithering
    getImageData_dithered(min, max) {
        const imageData = this.getImageData_lum();

        const spread = max - min;

        if (!imageData) return;

        // Iterate over each pixel
        for (let i = 0; i < imageData.data.length; i += 4) {
            // Since RGB values for greyscale images are equal, the R value can be used as the chrominance value
            let chrominance = imageData.data[i];

            const threshold = min + Math.floor(Math.random() * (spread + 1));

            chrominance >= threshold ? chrominance = 255 : chrominance = 0;
            
            // Set the r, g, b values to the avg - chrominance
            imageData.data[i] = chrominance;
            imageData.data[i + 1] = chrominance;
            imageData.data[i + 2] = chrominance;
        }

        return imageData;
    }

    // One-Dimensional Error Diffusion Dithering

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
        // this.displayGreyscale();
    }

    #displayImage(imageData) {        
        this.#canvas.width = imageData.width;
        this.#canvas.height = imageData.height;

        this.#ctx.putImageData(imageData, 0, 0);
    }

    displayOriginal() {
        const imageData = this.#imageDataHelper.getImageData();
        if (!imageData) {
            setTimeout(() => {
                this.displayOriginal();
            }, 1000);
            return;
        }
        
        this.#displayImage(imageData);
    }
    
    displayGreyscale() {
        const imageData = this.#imageDataHelper.getImageData_lum();
        if (!imageData) {
            setTimeout(() => {
                this.displayGreyscale();
            }, 1000);
            return;
        }

       this.#displayImage(imageData);

    }

    // black and white
    displayBW(threshold = 128) {
        const imageData = this.#imageDataHelper.getImageData_BW(threshold);
        if (!imageData) {
            setTimeout(() => {
                this.displayBW(threshold);
            }, 1000);
            return;
        }

        this.#displayImage(imageData);

    }

    displayDithered_rand(min = 0, max = 255) {
        const imageData = this.#imageDataHelper.getImageData_dithered(min, max);
        if (!imageData) {
            setTimeout(() => {
                this.displayDithered_rand(min, max);
            }, 1000);
            return;
        }

        this.#displayImage(imageData);
    }
}

document.querySelector('#apply_filter').addEventListener('click', () => {
    const img_input = document.querySelector('#img_input');
    if (img_input.files.length === 0) {
        alert('Please select an image.');
        return;
    }

    const img_url = URL.createObjectURL(img_input.files[0]);

    // Gets first instance of an input with anme "filters" that is checked
    const filter_radio = document.querySelector('input[name="filters"]:checked');
    if (filter_radio === null) {
        alert('Please select a filter');
        return;
    }

    const filter = filter_radio.getAttribute('value');

    // Clear canvases
    const canvases = document.querySelectorAll('canvas');
    canvases.forEach(canvas => {
        canvas.remove();
    });


    const filtered_image = new FilteredImage(img_url);
    switch (filter) {
        case 'og':
            filtered_image.displayOriginal();
            break;
        case 'grey':
            filtered_image.displayGreyscale();
            break;
        case 'bw':
            let threshold = 128;
            threshold = Number(prompt('Input threshold: 0 - 255 (inclusive)'));
            filtered_image.displayBW(threshold);
            break;
        case 'dither_rand':
            let lower = 0;
            let upper = 0;
            lower = Number(prompt('Input lower bound: 0 - 255 (inclusive)'));
            upper = Number(prompt('Input upper bound: 0 - 255 (inclusive)'));
            filtered_image.displayDithered_rand(lower, upper);
            break;
    }
});