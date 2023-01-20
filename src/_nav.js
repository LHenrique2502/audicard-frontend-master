export default {
  items: [
    {
      name: 'Dashboard',
      url: '/',
      icon: 'icon-speedometer',

    },
    {
      name: 'Administração',
      url: '#',
      icon: 'fa fa-lock',
      children: [
        {
          name: 'Usuários',
          url: '#',
          icon: 'fa fa-users',
          children: [
            {
              name: 'Novo',
              url: '/user/register',
              icon: 'fa fa-plus',
            },
            {
              name: 'Lista',
              url: '/user/list',
              icon: 'fa fa-list-ol',
            }
          ]
        }
      ],

    }, {
      name: 'Solicitações',
      url: '/solicitation',
      icon: 'fa fa-files-o',
      children: [
        {
          name: 'Nova',
          url: '/solicitation/register',
          icon: 'fa fa-plus',
        },
        {
          name: 'Lista',
          url: '/solicitation/list/all',
          icon: 'fa fa-list-ol',
        },
        {
          name: 'Relatório',
          url: '/solicitation/report',
          icon: 'fa fa-bug',
        }
      ]

    }

  ],
}
