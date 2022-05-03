import nc from 'next-connect';

const handler = nc();

handler.get(async (req, res) => {
  const categories = [
    'Plumbers',
    'Electricians',
    'Ac_Repair',
    'Carpenters',
    'Tv_Repair',
    'Computer_Repair',
  ];
  res.send(categories);
});

export default handler;
