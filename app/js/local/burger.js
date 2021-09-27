const burgerBtn = document.querySelector('.burger-menu');
const showMenu = () => {
    burgerBtn.setAttribute('data-menu', 'hidden');
    burgerBtn.addEventListener('click', () => {

        if (burgerBtn.getAttribute('data-menu') === 'hidden') {
            burgerBtn.setAttribute('data-menu', 'open');
        } else {
            burgerBtn.setAttribute('data-menu', 'hidden');
        }
    });
};
showMenu();
