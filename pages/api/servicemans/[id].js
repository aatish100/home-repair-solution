import nc from 'next-connect';
import client from '../../../utils/client';

const handler = nc();

handler.get(async (req, res) => {
  const serviceman = await client.fetch(
    `*[_type == "Serviceman" && _id == $id][0]`,
    {
      id: req.query.id,
    }
  );
  res.send(serviceman);
});
export default handler;
