import nc from 'next-connect';
import { isAuth } from '../../../utils/auth';
import client from '../../../utils/client';

const handler = nc();

handler.use(isAuth);
handler.get(async (req, res) => {
  const bookedservices = await client.fetch(
    `*[_type == "servicebooking" && user._ref == $userId]`,
    {
      userId: req.user._id,
    }
  );
  res.send(bookedservices);
});
export default handler;
