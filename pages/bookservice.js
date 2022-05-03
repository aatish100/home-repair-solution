import React, { useContext, useEffect, useState } from 'react';
import Layout from '../components/Layout';
import CheckoutWizard from '../components/CheckoutWizard';
import {
  Button,
  Card,
  CircularProgress,
  Grid,
  Link,
  List,
  ListItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import classes from '../utils/classes';
import { getError } from '../utils/error';
import { Store } from '../utils/Store';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import jsCookie from 'js-cookie';
import dynamic from 'next/dynamic';

function BookServiceScreen() {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const {
    userInfo,
    cart: { cartItems, serviceAddress, paymentMethod },
  } = state;
  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100; //123.456 =>123.46
  const servicePrice = round2(cartItems.reduce((a, c) => a + c.price * 1, 0));
  const taxPrice = round2(servicePrice * 0.15);
  const totalPrice = round2(servicePrice + taxPrice);
  useEffect(() => {
    if (!paymentMethod) {
      router.push('/payment');
    }
    if (cartItems.length === 0) {
      router.push('/cart');
    }
  }, [cartItems.length, paymentMethod, router]);
  const bookServiceHandler = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        '/api/bookedservices',
        {
          bookServices: cartItems.map((x) => ({
            ...x,
            appoimentAvailability: undefined,
            slug: undefined,
          })),
          serviceAddress,
          paymentMethod,
          servicePrice,
          taxPrice,
          totalPrice,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      dispatch({ type: 'CART_CLEAR' });
      jsCookie.remove('cartItems');
      setLoading(false);
      router.push(`/servicebooking/${data}`);
    } catch (err) {
      setLoading(false);
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  };
  return (
    <Layout title="Book Service">
      <CheckoutWizard activeStep={3}></CheckoutWizard>
      <Typography component="h1" variant="h1">
        Book Services Summary
      </Typography>
      <Grid container spacing={1}>
        <Grid item md={9} xs={12}>
          <Card sx={classes.section}>
            <List>
              <ListItem>
                <Typography component="h2" variant="h2">
                  Service Address
                </Typography>
              </ListItem>
              <ListItem>
                {serviceAddress.fullName}, {serviceAddress.address},{' '}
                {serviceAddress.city}, {serviceAddress.postalCode},{' '}
                {serviceAddress.country}
              </ListItem>
              <ListItem>
                <Button
                  onClick={() => router.push('/serviceadd')}
                  variant="contianed"
                  color="secondary"
                >
                  Edit
                </Button>
              </ListItem>
            </List>
          </Card>
          <Card sx={classes.section}>
            <List>
              <ListItem>
                <Typography component="h2" variant="h2">
                  Payment Method
                </Typography>
              </ListItem>
              <ListItem>{paymentMethod}</ListItem>
              <ListItem>
                <Button
                  onClick={() => router.push('/payment')}
                  variant="contianed"
                  color="secondary"
                >
                  Edit
                </Button>
              </ListItem>
            </List>
          </Card>
          <Card sx={classes.section}>
            <List>
              <ListItem>
                <Typography component="h2" variant="h2">
                  Book Services
                </Typography>
              </ListItem>
              <ListItem>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Image</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell align="right">Price</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {cartItems.map((item) => (
                        <TableRow key={item._key}>
                          <TableCell>
                            <NextLink
                              href={`/serviceman/${item.slug}`}
                              passHref
                            >
                              <Link>
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  width={50}
                                  height={50}
                                ></Image>
                              </Link>
                            </NextLink>
                          </TableCell>
                          <TableCell>
                            <NextLink
                              href={`/serviceman/${item.slug}`}
                              passHref
                            >
                              <Link>
                                <Typography>{item.name}</Typography>
                              </Link>
                            </NextLink>
                          </TableCell>
                          <TableCell align="right">
                            <Typography>Rs{item.price}</Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </ListItem>
            </List>
          </Card>
        </Grid>
        <Grid item md={3} xs={22}>
          <Card sx={classes.section}>
            <List>
              <ListItem>
                <Typography variant="h2">
                  Service Charges Including Tax
                </Typography>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item xs={4}>
                    <Typography>Charges:</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography align="right">Rs{servicePrice}</Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <Grid container>
                <Grid item xs={4}>
                  <Typography>
                    <strong>Total:</strong>
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography align="right">
                    <strong>Rs{totalPrice}</strong>
                  </Typography>
                </Grid>
              </Grid>
              <ListItem>
                <Button
                  onClick={bookServiceHandler}
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={loading}
                >
                  Book Service
                </Button>
              </ListItem>
              {loading && (
                <ListItem>
                  <CircularProgress />
                </ListItem>
              )}
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
}
export default dynamic(() => Promise.resolve(BookServiceScreen), {
  ssr: false,
});
