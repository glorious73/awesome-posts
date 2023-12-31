export const Routes = [
    {
        name: 'login',
        path: '/login',
        component: '<app-auth class="fade-in"></app-auth>'
    },
    {
        name: 'password.forgot',
        path: '/password/forgot',
        component: '<app-auth class="fade-in"></app-auth>'
    },
    {
        name: 'password.reset',
        path: '/password/reset',
        component: '<app-auth class="fade-in"></app-auth>'
    },
    {
        name: 'dashboard',
        path: '/',
        component: '<app-dashboard class="fade-in"></app-dashboard>'
    },
    {
        name: 'posts',
        path: '/posts',
        component: '<app-posts class="fade-in"></app-posts>'
    },
    {
        name: 'posts.new',
        path: '/posts/new',
        component: '<app-post-form class="fade-in"></app-post-form>'
    },
    {
        name: 'posts.edit',
        path: '/posts/:id/edit',
        component: '<app-post-form class="fade-in" data-match=""></app-post-form>'
    },
    {
        name: 'about',
        path: '/about',
        component: '<app-about class="fade-in"></app-about>'
    },
    {
        name: 'accounts',
        path: '/accounts/users',
        component: '<app-accounts class="fade-in"></app-accounts>'
    },
    {
        name: 'accounts.users.new',
        path: '/users/new',
        component: '<app-user-form class="fade-in"></app-user-form>'
    },
    {
        name: 'accounts.users.edit',
        path: '/users/:id/edit',
        component: '<app-user-edit class="fade-in" data-match=""></app-user-edit>'
    },
    {
        name: 'accounts.roles',
        path: '/accounts/roles',
        component: '<app-accounts class="fade-in"></app-accounts>'
    },
    {
        name: 'settings',
        path: '/settings',
        component: '<app-settings class="fade-in"></app-settings>'
    }
];