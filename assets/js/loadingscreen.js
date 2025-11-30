document.addEventListener('DOMContentLoaded', function() {
        const form = document.querySelector('form');
        const loadingScreen = document.getElementById('loading-screen');

        if (form && loadingScreen) {
            form.addEventListener('submit', function(event) {
                loadingScreen.classList.add('is-loading');

            });
        }
    });