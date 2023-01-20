export default {
  items: [
    {
      name: 'Dashboard',
      url: '/',
      icon: 'icon-speedometer',

    },
    {
      name: 'Solicitações',
      url: '/solicitation',
      icon: 'fa fa-user-circle-o',
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
        }
      ]

    }

  ],
}
