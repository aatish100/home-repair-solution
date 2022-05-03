import { Alert, CircularProgress, Grid } from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useContext, useEffect, useState } from 'react';
import Layout from '../components/Layout';
import ServicemanItem from '../components/ServicemanItem';
import client from '../utils/client';
import { urlForThumbnail } from '../utils/image';
import { Store } from '../utils/Store';

export default function Home() {
  const {
    state: { cart },
    dispatch,
  } = useContext(Store);
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [state, setState] = useState({
    servicemans: [],
    error: '',
    loading: true,
  });
  const { loading, error, servicemans } = state;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const servicemans = await client.fetch(`*[_type == "serviceman"]`);
        setState({ servicemans, loading: false });
      } catch (err) {
        setState({ loading: false, error: err.message });
      }
    };
    fetchData();
  }, []);
  const addServiceToCartHandler = async (serviceman) => {
    const existItem = cart.cartItems.find((x) => x._id === serviceman._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/servicemans/${serviceman._id}`);
    if (data.appoimentAvailability < quantity) {
      enqueueSnackbar(
        'Sorry. Appoiments for this serviceman is full for today',
        { variant: 'error' }
      );
      return;
    }
    dispatch({
      type: 'CART_ADD_ITEM',
      payload: {
        _key: serviceman._id,
        name: serviceman.name,
        appoimentAvailability: serviceman.appoimentAvailability,
        slug: serviceman.slug.current,
        price: serviceman.price,
        image: urlForThumbnail(serviceman.image),
        quantity,
      },
    });
    enqueueSnackbar(`${serviceman.name} service added to cart`, {
      variant: 'success',
    });
    router.push('/cart');
  };

  return (
    <Layout>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <Grid container spacing={4}>
          {servicemans.map((serviceman) => (
            <Grid item md={3} key={serviceman.slug}>
              <ServicemanItem
                serviceman={serviceman}
                addServiceToCartHandler={addServiceToCartHandler}
              ></ServicemanItem>
            </Grid>
          ))}
        </Grid>
      )}
    </Layout>
  );
}
