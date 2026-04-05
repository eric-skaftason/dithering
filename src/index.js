import { ImageRenderer } from "./ImageRenderer.js";

const demo_wrapper = document.querySelector('.demo_wrapper');
const demo_canvas = document.querySelector('canvas.demo');

// Minimise button
document.querySelector('.minimise').addEventListener('click', () => {
    demo_wrapper.toggleAttribute('hidden');
});

function getImageInfo() {
    const img_input = document.querySelector('#img_input');

    return img_input.files[0];
}

// Select image
const image_selector = document.querySelector('#sel_img');
const file_input = document.querySelector('#img_input');

image_selector.addEventListener('click', () => {
    file_input.click();
});
file_input.addEventListener('change', () => {
    image_selector.innerText = getImageInfo().name || image_selector.innerText;
});

// Select Filter
const filter_selector = document.querySelector('#sel_filter');
filter_selector.addEventListener('click', toggleFilterMenu);

function toggleFilterMenu() {
    const filter_menu = document.querySelector('#filter_menu');
    if (filter_menu === null) {
        createFilterMenu();
    } else {
        filter_menu.remove();
    }
}

function createFilterMenu() {
    const filter_menu = document.createElement('div');
    filter_menu.id = 'filter_menu';
    filter_menu.style.position = 'absolute';
    filter_menu.style.top = 0;
    filter_menu.style.left = 0;

    const list_elements = [
        ['Original', 'og'],
        ['Greyscale', 'grey'],
        ['Black and white', 'bw'],
        ['Random Dithering', 'dither_rand'],
        ['1 Dimensional Error Diffusion', 'err_diff'],
        ['Floyd Steinberg Dithering', 'floyd_steinberg']
    ];

    for (let i = 0; i < list_elements.length; i++) {
        const ele = document.createElement('dropdown-element');
        ele.innerText = list_elements[i][0];

        ele.addEventListener('click', () => {
            applyFilter(list_elements[i][1]);
        });
        
        filter_menu.appendChild(ele);
    }

    demo_wrapper.append(filter_menu);
}


// Apply filter
function applyFilter(filter) {
    const img_input = document.querySelector('#img_input');
    if (img_input.files.length === 0) {
        alert('Please select an image.');
        return;
    }

    const img_url = URL.createObjectURL(img_input.files[0]);

    // Clear canvases
    const canvases = document.querySelectorAll('canvas');
    canvases.forEach(canvas => {
        // canvas.remove();
    });


    const filtered_image = new ImageRenderer(img_url);
    switch (filter) {
        case 'og':
            filtered_image.displayOriginal(demo_canvas);
            break;
        case 'grey':
            filtered_image.displayGreyscale(demo_canvas);
            break;
        case 'bw':
            {
                let threshold = 128;
                threshold = Number(prompt('Input threshold: 0 - 255 (inclusive)'));
                filtered_image.displayBW(demo_canvas, threshold);
            }
            break;
        case 'dither_rand':
            {
                let lower = 0;
                let upper = 0;
                lower = Number(prompt('Input lower bound: 0 - 255 (inclusive)'));
                upper = Number(prompt('Input upper bound: 0 - 255 (inclusive)'));
                filtered_image.displayDithered_rand(demo_canvas, lower, upper);
            }
            break;
        case 'err_diff':
            {
                let threshold = 128;
                threshold = Number(prompt('Input threshold: 0 - 255 (inclusive)'));
                filtered_image.displayDithered_errDiff(demo_canvas, threshold);
            }
            break;
        case 'floyd_steinberg':
            {
                filtered_image.displayDithered_FloydSteinberg(demo_canvas);
            }
            break;
    }

}