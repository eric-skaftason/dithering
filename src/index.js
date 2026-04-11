import { ImageRenderer } from "./ImageRenderer.js";
import params from './params.js';

const demo_wrapper = document.querySelector('.demo_wrapper');
const demo_canvas = document.querySelector('canvas.demo');

// Minimise button
document.querySelector('#minimise').addEventListener('click', () => {
    demo_wrapper.classList.toggle('hidden');
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
    image_selector.innerText = 'Select Image';
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
            filter_menu.remove();
        });
        
        filter_menu.appendChild(ele);
    }

    demo_wrapper.append(filter_menu);
}

// Change demo dimensions
function applyDimensions(width, height) {
    demo_canvas.width = width;
    demo_canvas.height = height;

    demo_canvas.style.width = `${width}px`;
    demo_canvas.style.height = `${height}px`;
}

// Apply filter
async function applyFilter(filter) {
    const img_input = document.querySelector('#img_input');
    if (img_input.files.length === 0) {
        alert('Please select an image.');
        return;
    }

    const img_url = URL.createObjectURL(img_input.files[0]);

    const filtered_image = new ImageRenderer(img_url);
    await filtered_image.ready;

    const dimensions = await filtered_image.getDimensions();

    if (
        dimensions.width > params.canvas.max_width ||
        dimensions.height > params.canvas.max_height
    ) {
        alert('Image too large. Please select an image with max dimensions 1000 x 1000 pixels.');
        return;
    } else {
        applyDimensions(dimensions.width, dimensions.height);
    }

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


// Help
document.querySelector('#help').addEventListener('click', toggleDemoHelpMenu);

function toggleDemoHelpMenu() {
    const modal_menu = document.querySelector('.modal_menu');

    if (modal_menu === null) {
        createDemoHelpMenu();
    } else {
        closeDemoHelpMenu();
    }
}

function closeDemoHelpMenu() {
    const modal_menu = document.querySelector('.modal_menu');
    const modal = document.querySelector('.modal');

    document.body.style.overflow = 'auto';

    modal_menu.remove();
    modal.remove();
}

function createDemoHelpMenu() {
    window.scrollTo({
        top: 0,
    });


    // Modal menu
    const modal_menu = document.createElement('div');
    modal_menu.classList.add('modal_menu');

    // Modal element
    const modal = document.createElement('div');
    modal.classList.add('modal');

    document.body.style.overflow = 'hidden';

    // Window controls
    const modal_window_controls = document.createElement('div');
    modal_window_controls.classList.add('modal_window_controls');

    const modal_title = document.createElement('div');
    modal_title.setAttribute('id', 'modal_title');
    modal_title.innerText = 'Demo Instructions';
    
    const close_modal = document.createElement('button');
    close_modal.setAttribute('id', 'close_modal');
    close_modal.innerText = 'x';

    close_modal.addEventListener('click', () => {
        closeDemoHelpMenu();
    });

    modal_window_controls.append(modal_title);
    modal_window_controls.append(close_modal);

    // Modal menu body
    const modal_body = document.createElement('div');
    modal_body.classList.add('modal_body');

    modal_body.innerHTML = `
        <p><strong style="text-align: "centre"">Instructions</strong></p>

        <ol>
            <li>CLick 'Select Image' to select an image from your computer</li>
            <li>Click 'Select Filter' and select a filter from the menu to apply</li>
        </ol>

        <p>Note: the image must be equal to or less than 1000 x 1000 pixels in size.</p>
    
    `;
    
    
    modal_menu.append(modal_window_controls);
    modal_menu.append(modal_body);

    document.body.append(modal_menu);
    document.body.append(modal);
    
}