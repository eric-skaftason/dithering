const demo_wrapper = document.querySelector('.demo_wrapper');

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
filter_selector.addEventListener('click', () => {
    const menu = document.createElement('div');
    menu.style.position = 'absolute';
    menu.style.top = 0;
    menu.style.left = 0;

    const list_elements = 

    for (let i = 0; i < 5; i++) {
        const ele = document.createElement('dropdown-element');
        menu.appendChild(ele);
    }

    demo_wrapper.append(menu);
});