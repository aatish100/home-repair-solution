import {
  Alert,
  Button,
  CircularProgress,
  Grid,
  List,
  ListItem,
  MenuItem,
  Rating,
  Select,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import React, { useContext, useEffect, useState } from 'react';
import Layout from '../components/Layout';
import ServicemanItem from '../components/ServicemanItem';
import classes from '../utils/classes';
import client from '../utils/client';
import { urlForThumbnail } from '../utils/image';
import { Store } from '../utils/Store';

const prices = [
  {
    name: 'RS1 to Rs50',
    value: '1-50',
  },
  {
    name: 'Rs51 to Rs200',
    value: '51-200',
  },
  {
    name: 'Rs201 to Rs1000',
    value: '201-1000',
  },
];

const ratings = [1, 2, 3, 4, 5];

export default function SearchScreen() {
  const router = useRouter();
  const {
    category = 'all',
    query = 'all',
    price = 'all',
    rating = 'all',
    sort = 'default',
  } = router.query;
  const [state, setState] = useState({
    categories: [],
    servicemans: [],
    error: '',
    loading: true,
  });

  const { loading, servicemans, error } = state;
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`/api/servicemans/categories`);
        setCategories(data);
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchCategories();

    const fetchData = async () => {
      try {
        let gQuery = '*[_type == "serviceman"';
        if (category !== 'all') {
          gQuery += ` && category match "${category}" `;
        }
        if (query !== 'all') {
          gQuery += ` && name match "${query}" `;
        }
        if (price !== 'all') {
          const minPrice = Number(price.split('-')[0]);
          const maxPrice = Number(price.split('-')[1]);
          gQuery += ` && price >= ${minPrice} && price <= ${maxPrice}`;
        }
        if (rating !== 'all') {
          gQuery += ` && rating >= ${Number(rating)} `;
        }

        gQuery += `]`;
        setState({ loading: true });

        const servicemans = await client.fetch(gQuery);
        setState({ servicemans, loading: false });
      } catch (err) {
        setState({ error: err.message, loading: false });
      }
    };
    fetchData();
  }, [category, price, query, rating, sort]);

  const filterSearch = ({ category, sort, searchQuery, price, rating }) => {
    const path = router.pathname;
    const { query } = router;
    if (searchQuery) query.searchQuery = searchQuery;
    if (category) query.category = category;
    if (sort) query.sort = sort;
    if (price) query.price = price;
    if (rating) query.rating = rating;
    router.push({
      pathname: path,
      query: query,
    });
  };

  const categoryHandler = (e) => {
    filterSearch({ category: e.target.value });
  };

  const priceHandler = (e) => {
    filterSearch({ price: e.target.value });
  };
  const ratingHandler = (e) => {
    filterSearch({ rating: e.target.value });
  };
  const {
    state: { cart },
    dispatch,
  } = useContext(Store);
  const { enqueueSnackbar } = useSnackbar();
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
    enqueueSnackbar(`${serviceman.name}'s service added to cart`, {
      variant: 'success',
    });
    router.push('/cart');
  };
  return (
    <Layout title="search">
      <Grid sx={classes.section} container spacing={2}>
        <Grid item md={3}>
          <List>
            <ListItem>
              <Box sx={classes.fullWidth}>
                <Typography>Categories</Typography>
                <Select fullWidth value={category} onChange={categoryHandler}>
                  <MenuItem value="all">All</MenuItem>
                  {categories &&
                    categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                </Select>
              </Box>
            </ListItem>
            <ListItem>
              <Box sx={classes.fullWidth}>
                <Typography>Prices</Typography>
                <Select value={price} onChange={priceHandler} fullWidth>
                  <MenuItem value="all">All</MenuItem>
                  {prices.map((price) => (
                    <MenuItem key={price.value} value={price.value}>
                      {price.name}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            </ListItem>
            <ListItem>
              <Box sx={classes.fullWidth}>
                <Typography>Ratings</Typography>
                <Select value={rating} onChange={ratingHandler} fullWidth>
                  <MenuItem value="all">All</MenuItem>
                  {ratings.map((rating) => (
                    <MenuItem dispaly="flex" key={rating} value={rating}>
                      <Rating value={rating} readOnly />
                      <Typography component="span">&amp; Up</Typography>
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            </ListItem>
          </List>
        </Grid>
        <Grid item md={9}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item>
              {servicemans && servicemans.length !== 0
                ? servicemans.length
                : 'No'}{' '}
              Results
              {query !== 'all' && query !== '' && ' : ' + query}
              {price !== 'all' && ' : Price ' + price}
              {rating !== 'all' && ' : Rating ' + rating + ' & up'}
              {(query !== 'all' && query !== '') ||
              rating !== 'all' ||
              price !== 'all' ? (
                <Button onClick={() => router.push('/search')}>X</Button>
              ) : null}
            </Grid>
          </Grid>

          <Grid sx={classes.section} container spacing={3}>
            {loading ? (
              <CircularProgress />
            ) : error ? (
              <Alert>{error}</Alert>
            ) : (
              <Grid container spacing={3}>
                {servicemans.map((serviceman) => (
                  <Grid item md={4} key={serviceman.name}>
                    <ServicemanItem
                      serviceman={serviceman}
                      addServiceToCartHandler={addServiceToCartHandler}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Layout>
  );
}
