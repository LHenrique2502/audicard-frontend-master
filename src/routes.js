import React from 'react';


const Dashboard = React.lazy(() => import('./views/Dashboard'));
//Routes de Groups
const GroupList = React.lazy(() => import('./views/Groups/List'));
const GroupRegister = React.lazy(() => import('./views/Groups/Register'));
const GroupEdit = React.lazy(() => import('./views/Groups/Edit'));

//Routes de Usuarios
const UserList = React.lazy(() => import('./views/Users/List'));
const UserRegister = React.lazy(() => import('./views/Users/Register'));
const UserEdit = React.lazy(() => import('./views/Users/Edit'));

//Routes de Solicitação
const SolicitationList = React.lazy(() => import('./views/Solicitation/List'));
const SolicitationRegister = React.lazy(() => import('./views/Solicitation/Register'));
const SolicitationEdit = React.lazy(() => import('./views/Solicitation/Edit'));
const SolicitationRead = React.lazy(() => import('./views/Solicitation/Read'));
const SolicitationReport = React.lazy(()=> import('./views/Solicitation/Report') )


// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
    {path: '/', exact: true, name: 'Home'},
    {path: '/dashboard', name: 'Dashboard', component: Dashboard},
    {path: '/group/list', name: 'Listagem Grupos', component: GroupList},
    {path: '/group/register', name: 'Registro de Grupo', component: GroupRegister},
    {path: '/group/edit/:id', name: 'Edição de Grupo', component: GroupEdit},
    {path: '/user/list', name: 'Listagem de usuario(s)', component: UserList},
    {path: '/user/register', name: 'Registro de usuario', component: UserRegister},
    {path: '/user/edit/:id', name: 'Edição de usuario', component: UserEdit},
    {path: '/solicitation/list/:status', name: 'Listagem de solicitações', component: SolicitationList},
    {path: '/solicitation/register', name: 'Registro de solicitação', component: SolicitationRegister},
    {path: '/solicitation/edit/:id', name: 'Edição de solicitação', component: SolicitationEdit},
    {path: '/solicitation/read/:id', name: 'Leitura da solicitação', component: SolicitationRead},
    {path: '/solicitation/report', name: 'Relatório de solicitações', component: SolicitationReport},
];

export default routes;
