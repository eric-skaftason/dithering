class ImageProcessor {
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
    getImageData_errDiff(threshold) {
        const imageData = this.getImageData_lum();
        if (!imageData) return;

        let offset = 0;

        for (let i = 0; i < imageData.data.length; i += 4) {
            const chrominance = imageData.data[i] + offset;
            if (chrominance >= threshold) {
                // white
                imageData.data[i] = 255;
                imageData.data[i + 1] = 255;
                imageData.data[i + 2] = 255;

                offset = chrominance - 255;
            } else {
                imageData.data[i] = 0;
                imageData.data[i + 1] = 0;
                imageData.data[i + 2] = 0;

                offset = chrominance - 0;
            }
        }

        return imageData;
    }

}

export { ImageProcessor };