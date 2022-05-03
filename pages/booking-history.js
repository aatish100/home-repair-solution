import {
  Alert,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import React, { useContext, useEffect, useReducer } from 'react';
import { getError } from '../utils/error';
import axios from 'axios';
import { Store } from '../utils/Store';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import NextLink from 'next/link';
import dynamic from 'next/dynamic';
function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, bookings: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, bookings: action.payload };
    default:
      state;
  }
}

function BookingHistoryScreen() {
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [{ loading, error, bookings }, dispatch] = useReducer(reducer, {
    loading: true,
    bookings: [],
    error: '',
  });
  const router = useRouter();
  useEffect(() => {
    if (!userInfo) {
      router.push('/login');
    }
    const fetchBookings = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/bookedservices/history`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });

        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchBookings();
  }, [router, userInfo]);
  return (
    <Layout title="Booking History">
      <Typography component="h1" variant="h1">
        Booking History
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>DATE</TableCell>
                <TableCell>TOTAL</TableCell>
                <TableCell>PAID</TableCell>
                <TableCell>ACTION</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking._id}>
                  <TableCell>{booking._id}</TableCell>
                  <TableCell>{booking.createdAt}</TableCell>
                  <TableCell>Rs{booking.totalPrice}</TableCell>
                  <TableCell>
                    {booking.isPaid ? `paid at ${booking.paidAt}` : 'not paid'}
                  </TableCell>
                  <TableCell>
                    <NextLink href={`/servicebooking/${booking._id}`} passHref>
                      <Button variant="contained">Details</Button>
                    </NextLink>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Layout>
  );
}
export default dynamic(() => Promise.resolve(BookingHistoryScreen), {
  ssr: false,
});
