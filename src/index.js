const demo_wrapper = document.querySelector('.demo_wrapper');

document.querySelector('.minimise').addEventListener('click', () => {
    demo_wrapper.toggleAttribute('hidden');
});