import {
  Alert,
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
import NextLink from 'next/link';
import dynamic from 'next/dynamic';
import React, { useContext, useEffect, useReducer } from 'react';
import Layout from '../../components/Layout';
import classes from '../../utils/classes';
import Image from 'next/image';
import { Store } from '../../utils/Store';
import { useRouter } from 'next/router';
import { getError } from '../../utils/error';
import axios from 'axios';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        loading: false,
        servicebooking: action.payload,
        error: '',
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
  }
}
function ServiceBookingScreen({ params }) {
  const { id: servicebookingId } = params;
  const [{ loading, error, servicebooking }, dispatch] = useReducer(reducer, {
    loading: true,
    servicebooking: {},
    error: '',
  });
  const {
    serviceAddress,
    paymentMethod,
    bookServices,
    servicePrice,
    taxPrice,
    totalPrice,
    isPaid,
    paidAt,
    isServiced,
    ServicedAt,
  } = servicebooking;
  const router = useRouter();
  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    if (!userInfo) {
      return router.push('/login');
    }
    const fetchServicebooking = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(
          `/api/bookedservices/${servicebookingId}`,
          {
            headers: { authorization: `Bearer ${userInfo.token}` },
          }
        );
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchServicebooking();
  }, [router, servicebookingId, userInfo]);

  return (
    <Layout title={`Servicebooking ${servicebookingId}`}>
      <Typography component="h1" variant="h1">
        Service Booking {servicebookingId}
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert variant="error">{error}</Alert>
      ) : (
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
                  Status:{' '}
                  {isServiced ? `serviced at ${ServicedAt}` : 'not serviced'}
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
                  Status: {isPaid ? `paid at ${paidAt}` : 'not paid'}
                </ListItem>
              </List>
            </Card>

            <Card sx={classes.section}>
              <List>
                <ListItem>
                  <Typography component="h2" variant="h2">
                    Booked Services
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
                        {bookServices.map((serviceman) => (
                          <TableRow key={serviceman._key}>
                            <TableCell>
                              <NextLink
                                href={`/serviceman/${serviceman.slug}`}
                                passHref
                              >
                                <Link>
                                  <Image
                                    src={serviceman.image}
                                    alt={serviceman.name}
                                    width={50}
                                    height={50}
                                  ></Image>
                                </Link>
                              </NextLink>
                            </TableCell>
                            <TableCell>
                              <NextLink
                                href={`/serviceman/${serviceman.slug}`}
                                passHref
                              >
                                <Link>
                                  <Typography>{serviceman.name}</Typography>
                                </Link>
                              </NextLink>
                            </TableCell>
                            <TableCell align="right">
                              <Typography>Rs{serviceman.price}</Typography>
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
          <Grid>
            <Grid item md={9} xs={15}>
              <Card sx={classes.section}>
                <List>
                  <ListItem>
                    <Typography variant="h2">
                      Service Booking Summary
                    </Typography>
                  </ListItem>
                  <ListItem>
                    <Grid container>
                      <Grid item xs={6}>
                        <Typography>Serviceman:</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography align="right">Rs{servicePrice}</Typography>
                      </Grid>
                    </Grid>
                  </ListItem>
                  <ListItem>
                    <Grid container>
                      <Grid item xs={6}>
                        <Typography>Tax:</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography align="right">Rs{taxPrice}</Typography>
                      </Grid>
                    </Grid>
                  </ListItem>
                  <ListItem>
                    <Grid container>
                      <Grid item xs={6}>
                        <Typography>
                          <strong>Total:</strong>
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography align="right">
                          <strong>Rs{totalPrice}</strong>
                        </Typography>
                      </Grid>
                    </Grid>
                  </ListItem>
                </List>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      )}
    </Layout>
  );
}
export function getServerSideProps({ params }) {
  return { props: { params } };
}
export default dynamic(() => Promise.resolve(ServiceBookingScreen), {
  ssr: false,
});
