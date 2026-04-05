import { ImageProcessor } from "./ImageProcessor.js";

class ImageRenderer {
    #src;
    #canvas;
    #ctx;

    #ImageProcessor;

    constructor(src) {
        // Define source
        this.#src = src;

        // Initialise ImageProcessor
        this.#ImageProcessor = new ImageProcessor(src);

        // Create canvas
        // this.#canvas = document.createElement('canvas');
        // this.#ctx = this.#canvas.getContext('2d');
        // this.#ctx.imageSmoothingEnabled = false;
        // document.body.append(this.#canvas);

    }

    #displayImage(canvas, imageData) {        
        canvas.width = imageData.width;
        canvas.height = imageData.height;

        const ctx = canvas.getContext('2d');
        ctx.putImageData(imageData, 0, 0);
    }

    displayOriginal(canvas) {
        const imageData = this.#ImageProcessor.getImageData();
        if (!imageData) {
            setTimeout(() => {
                this.displayOriginal(canvas);
            }, 1000);
            return;
        }
        
        this.#displayImage(canvas, imageData);
    }
    
    displayGreyscale(canvas) {
        const imageData = this.#ImageProcessor.getImageData_lum();
        if (!imageData) {
            setTimeout(() => {
                this.displayGreyscale(canvas);
            }, 1000);
            return;
        }

       this.#displayImage(canvas, imageData);

    }

    // black and white
    displayBW(canvas, threshold = 128) {
        const imageData = this.#ImageProcessor.getImageData_BW(threshold);
        if (!imageData) {
            setTimeout(() => {
                this.displayBW(canvas, threshold);
            }, 1000);
            return;
        }

        this.#displayImage(canvas, imageData);

    }

    displayDithered_rand(canvas, min = 0, max = 255) {
        const imageData = this.#ImageProcessor.getImageData_dithered(min, max);
        if (!imageData) {
            setTimeout(() => {
                this.displayDithered_rand(canvas, min, max);
            }, 1000);
            return;
        }

        this.#displayImage(canvas, imageData);
    }

    displayDithered_errDiff(canvas, threshold = 128) {
        const imageData = this.#ImageProcessor.getImageData_errDiff(threshold);
        if (!imageData) {
            setTimeout(() => {
                this.displayDithered_errDiff(canvas, threshold);
            }, 1000);
            return;
        }

        this.#displayImage(canvas, imageData);
    }

    displayDithered_FloydSteinberg(canvas) {
        const imageData = this.#ImageProcessor.getImageData_FloydSteinberg();
        if (!imageData) {
            setTimeout(() => {
                this.displayDithered_FloydSteinberg(canvas);
            }, 1000);
            return;
        }

        this.#displayImage(canvas, imageData);
    }
}

/*
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


    const filtered_image = new ImageRenderer(img_url);
    switch (filter) {
        case 'og':
            filtered_image.displayOriginal();
            break;
        case 'grey':
            filtered_image.displayGreyscale();
            break;
        case 'bw':
            {
                let threshold = 128;
                threshold = Number(prompt('Input threshold: 0 - 255 (inclusive)'));
                filtered_image.displayBW(threshold);
            }
            break;
        case 'dither_rand':
            {
                let lower = 0;
                let upper = 0;
                lower = Number(prompt('Input lower bound: 0 - 255 (inclusive)'));
                upper = Number(prompt('Input upper bound: 0 - 255 (inclusive)'));
                filtered_image.displayDithered_rand(lower, upper);
            }
            break;
        case 'err_diff':
            {
                let threshold = 128;
                threshold = Number(prompt('Input threshold: 0 - 255 (inclusive)'));
                filtered_image.displayDithered_errDiff(threshold);
            }
            break;
        case 'floyd_steinberg':
            {
                filtered_image.displayDithered_FloydSteinberg();
            }
            break;

    }
});
*/

export { ImageRenderer };