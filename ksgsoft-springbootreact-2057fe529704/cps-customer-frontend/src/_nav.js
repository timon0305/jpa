export default {
  items: [
    {
      name: 'Customer Record Administration',
      url: '/customer_admin',
      children: [
        {
          name: 'Customer Record Admin Data',
          url: '/customer_admin/customer_data',
        },
        // {
        //   name: 'Customer Record Selection',
        //   url: '/customer_admin/customer_selection',
        // },
        {
          name: 'Pointer Record Admin Data',
          url: '/customer_admin/pointer_data',
        },
        {
          name: 'Call Processing',
          url: '/customer_admin/cpr'
        },
        {
          name: 'Label Definition',
          url: '/customer_admin/lad'
        },
        // {
        //   name: 'Customer Record Audit/Resend',
        //   url: '/customer_admin/audit',
        // }
      ],
    },
    {
      name: 'Template Administration',
      url: '/template_admin',
      children: [
        {
          name: 'Template Admin Data',
          url: '/template_admin/tad'
        },
        // {
        //   name: 'Template Record Selection',
        //   url: '/template_admin/template_selection',
        // },
        {
          name: 'Template Record List',
          url: '/template_admin/template_list',
        },
      ],
    },
    {
      name: 'Number Administration',
      url: '/number_admin',
      children: [
        {
          name: 'Number Search',
          url: '/number_admin/number_search',
        },
        // {
        //   name: 'Reservation Limit',
        //   url: '/number_admin/reservation_limit',
        // },
        {
          name: 'Reserved Number List',
          url: '/number_admin/rnl'
        },
        {
          name: 'Number Query and Update',
          url: '/number_admin/number_query',
        },
        {
          name: 'Number Status Change',
          url: '/number_admin/number_status',
        },
        {
          name: 'Trouble Referral Number Query',
          url: '/number_admin/trouble',
        },
        {
          name: 'One Click Activate',
          url: '/number_admin/oneClick',
        },
        // {
        //   name: 'NumberStatus Request List',
        //   url: '/number_admin/bulk',
        // },

      ],
    },
    {
      name: 'System Automation Administration',
      url: '/system_admin',
      children: [
        {
          name: 'Multi Number Change Resp Org',
          url: '/system_admin/mro',
        },
        {
          name: 'Multi Number Query',
          url: '/system_admin/mnq'
        },
        {
          name: 'Multiple Conversion to Pointer Records',
          url: '/system_admin/mcp'
        }
      ],
    },
  ],
};
