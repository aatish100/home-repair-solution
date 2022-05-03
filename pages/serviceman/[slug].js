import {
  Alert,
  Box,
  Button,
  Card,
  CircularProgress,
  Grid,
  Link,
  List,
  ListItem,
  Rating,
  Typography,
} from '@mui/material';
import Image from 'next/image';
import NextLink from 'next/link';
import { useContext, useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import Layout from '../../components/Layout';
import classes from '../../utils/classes';
import client from '../../utils/client';
import { urlFor, urlForThumbnail } from '../../utils/image';
import { Store } from '../../utils/Store';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function ServicemanScreen(props) {
  const router = useRouter();
  const { slug } = props;
  const {
    state: { cart },
    dispatch,
  } = useContext(Store);
  const { enqueueSnackbar } = useSnackbar();
  const [state, setState] = useState({
    serviceman: null,
    loading: true,
    error: '',
  });
  const { serviceman, loading, error } = state;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const serviceman = await client.fetch(
          `
              *[_type == "serviceman" && slug.current == $slug][0]`,
          { slug }
        );
        setState({ ...state, serviceman, loading: false });
      } catch (err) {
        setState({ ...state, error: err.message, loading: false });
      }
    };
    fetchData();
  }, [slug, state]);

  const addServiceToCartHandler = async () => {
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
    enqueueSnackbar(`${serviceman.name}'s service added to cart`, {
      variant: 'success',
    });
    router.push('/cart');
  };

  return (
    <Layout title={serviceman?.title}>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert variant="error">{error}</Alert>
      ) : (
        <Box>
          <Box sx={classes.section}>
            <NextLink href="/" passHref>
              <Link>
                <Typography>back to result</Typography>
              </Link>
            </NextLink>
          </Box>
          <Grid container spacing={1}>
            <Grid item md={6} xs={12}>
              <Image
                src={urlFor(serviceman.image)}
                alt={serviceman.name}
                layout="responsive"
                width={640}
                height={640}
              />
            </Grid>
            <Grid md={3} xs={12}>
              <List>
                <ListItem>
                  <Typography component="h1" variant="h1">
                    {serviceman.name}
                  </Typography>
                </ListItem>
                <ListItem>Category:{serviceman.category}</ListItem>
                <ListItem>
                  <Rating value={serviceman.rating} readOnly></Rating>
                  <Typography sx={classes.smallText}>
                    ({serviceman.numReviews} reviews)
                  </Typography>
                </ListItem>
                <ListItem>
                  <Typography>Description: {serviceman.description}</Typography>
                </ListItem>
              </List>
            </Grid>
            <Grid item md={3} xs={12}>
              <Card>
                <List>
                  <ListItem>
                    <Grid container>
                      <Grid item xs={6}>
                        <Typography>Price</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography>Rs{serviceman.price}</Typography>
                      </Grid>
                    </Grid>
                  </ListItem>
                  <ListItem>
                    <Grid container>
                      <Grid item xs={6}>
                        <Typography>Status</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography>
                          {serviceman.appoimentAvailability > 0
                            ? 'Appoiment Available'
                            : 'Appoiment full'}
                        </Typography>
                      </Grid>
                    </Grid>
                  </ListItem>
                  <ListItem>
                    <Button
                      onClick={addServiceToCartHandler}
                      fullWidth
                      variant="contained"
                    >
                      Add service to cart
                    </Button>
                  </ListItem>
                </List>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}
    </Layout>
  );
}
export function getServerSideProps(context) {
  return {
    props: { slug: context.params.slug },
  };
}
