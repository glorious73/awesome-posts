export const Routes = [
    {
        name: 'login',
        path: '/login',
        component: '<app-auth class="fade-in"></app-auth>'
    },
    {
        name: 'dashboard',
        path: '/',
        component: '<app-dashboard class="fade-in"></app-dashboard>'
    },
    {
        name: 'about',
        path: '/about',
        component: '<app-about class="fade-in"></app-about>'
    },
    {
        name: 'settings',
        path: '/settings',
        component: '<app-settings class="fade-in"></app-settings>'
    }
];