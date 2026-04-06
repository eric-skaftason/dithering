import { ImageProcessor } from "./ImageProcessor.js";

class ImageRenderer {
    #ImageProcessor;

    constructor(src) {
        // Initialise ImageProcessor
        this.#ImageProcessor = new ImageProcessor(src);

        // this.#ImageProcessor.ready is a promise object
        // this.ready is a reference to this.#ImageProcessor.ready
        // calling await this.ready returns a what the promise resolves to
        // calling this.ready returns the promise object
        this.ready = this.#ImageProcessor.ready;
    }

    async getDimensions() {
        await this.ready;

        const imageData = this.#ImageProcessor.getImageData();

        return {width: imageData.width, height: imageData.height};
    }

    #displayImage(canvas, imageData) {        
        canvas.width = imageData.width;
        canvas.height = imageData.height;

        const ctx = canvas.getContext('2d');
        ctx.putImageData(imageData, 0, 0);
    }

    async displayOriginal(canvas) {
        await this.ready;
        
        const imageData = this.#ImageProcessor.getImageData();        
        this.#displayImage(canvas, imageData);
    }
    
    async displayGreyscale(canvas) {
        await this.ready;

        const imageData = this.#ImageProcessor.getImageData_lum();
        this.#displayImage(canvas, imageData);
    }

    // black and white
    async displayBW(canvas, threshold = 128) {
        await this.ready;

        const imageData = this.#ImageProcessor.getImageData_BW(threshold);
        this.#displayImage(canvas, imageData);
    }

    async displayDithered_rand(canvas, min = 0, max = 255) {
        await this.ready;

        const imageData = this.#ImageProcessor.getImageData_dithered(min, max);
        this.#displayImage(canvas, imageData);
    }

    async displayDithered_errDiff(canvas, threshold = 128) {
        await this.ready;

        const imageData = this.#ImageProcessor.getImageData_errDiff(threshold);
        this.#displayImage(canvas, imageData);
    }

    async displayDithered_FloydSteinberg(canvas) {
        await this.ready;

        const imageData = this.#ImageProcessor.getImageData_FloydSteinberg();
        this.#displayImage(canvas, imageData);
    }
}

export { ImageRenderer };