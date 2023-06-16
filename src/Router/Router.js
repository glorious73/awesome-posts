import Navigo from "navigo";
    
export const router = new Navigo('/');    

router.hooks({
    after(match) {
        document.dispatchEvent(new CustomEvent('LocationChangedEvent', {detail: match}));
    }
});

router.on({
    '/': {
        as: 'dashboard',
        uses: () => showComponent(`
        <h1>Home</h1>
        <h2>Welcome</h2>
        <div style="display: flex; column-gap: 1rem; min-height: 150%;">
            <a href="/" data-navigo>Home</a>
            <a href="/about?foo=bar&mewo=haw" data-navigo>About</a>
        </div>`)
    },
    '/about':{
        as: 'about',
        uses: (match) => showComponent(`
        <h1>About</h1><h2>This is about</h2><div class="card">
        <a href="/" data-navigo>Home</a>
        <a href="/about" data-navigo>About</a>
        </div>`)
    }
});

router.notFound(() => {
    document.querySelector('#app').innerHTML = `<h1>Whoops</h1><h2>Page not found</h2><div class="card">
            <a href="/" data-navigo>Home</a>
            </div>`;
});

function showComponent(componentHTML) {
    const app = document.querySelector('#app');
    app.innerHTML = '';
    app.insertAdjacentHTML('beforeend', componentHTML); 
}

document.addEventListener('NavigateEvent', (e) => router.navigateByName(e.detail));
    
