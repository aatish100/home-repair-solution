export default {
  name: 'servicebooking',
  title: 'servicebooking',
  type: 'document',
  fields: [
    {
      title: 'User',
      name: 'user',
      type: 'reference',
      to: [{ type: 'user' }],
      options: {
        disableNew: true,
      },
    },
    {
      name: 'userName',
      title: 'User Name',
      type: 'string',
    },
    {
      name: 'servicePrice',
      title: 'servicePrice',
      type: 'number',
    },
    {
      name: 'taxPrice',
      title: 'taxPrice',
      type: 'number',
    },
    {
      name: 'totalPrice',
      title: 'totalPrice',
      type: 'number',
    },
    {
      name: 'paymentMethod',
      title: 'paymentMethod',
      type: 'string',
    },
    {
      title: 'serviceAddress',
      name: 'serviceAddress',
      type: 'serviceAddress',
    },
    {
      title: 'paymentResult',
      name: 'paymentResult',
      type: 'paymentResult',
    },
    {
      title: 'Booked services',
      name: 'bookServices',
      type: 'array',
      of: [
        {
          title: 'Book services',
          type: 'bookServices',
        },
      ],
    },
    {
      title: 'IsPaid',
      name: 'isPaid',
      type: 'boolean',
    },
    {
      title: 'Paid Date',
      name: 'paidAt',
      type: 'datetime',
    },
    {
      title: 'IsServiced',
      name: 'isServiced',
      type: 'boolean',
    },
    {
      title: 'ServicedAt',
      name: 'servicedAt',
      type: 'datetime',
    },
    {
      title: 'CreatedAt',
      name: 'createdAt',
      type: 'datetime',
    },
  ],
};
