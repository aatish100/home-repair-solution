import {
  Box,
  Button,
  Card,
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
import Layout from '../components/Layout';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useContext } from 'react';
import { Store } from '../utils/Store';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import { useRouter } from 'next/router';

function CartScreen() {
  const router = useRouter();
  const {
    state: {
      cart: { cartItems },
    },
    dispatch,
  } = useContext(Store);
  const { enqueueSnackbar } = useSnackbar();
  // eslint-disable-next-line no-unused-vars
  const updateCartHandler = async (item, quantity) => {
    const { data } = await axios.get(`/api/servicemans/${item._id}`);
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
        _key: item._key,
        name: item.name,
        appoimentAvailability: item.appoimentAvailability,
        slug: item.slug,
        price: item.price,
        image: item.image,
        quantity,
      },
    });
    enqueueSnackbar(`${item.name}'s service updated in the cart`, {
      variant: 'success',
    });
  };
  const removeItemHandler = (item) => {
    dispatch({ type: 'CART_REMOVE_ITEM', payload: item });
  };
  return (
    <Layout title="Services Cart">
      <Typography component="h1" variant="h1">
        Services Cart
      </Typography>

      {cartItems.length === 0 ? (
        <Box>
          <Typography>
            Your cart is empty...
            <NextLink href="/" passHref>
              <Link>Add a serviceman to the cart</Link>
            </NextLink>
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={1}>
          <Grid item md={9} xs={12}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Serviceman</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cartItems.map((item) => (
                    <TableRow key={item._key}>
                      <TableCell>
                        <NextLink href={`/serviceman/${item.slug}`} passHref>
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
                        <NextLink href={`/serviceman/${item.slug}`} passHref>
                          <Link>
                            <Typography>{item.name}</Typography>
                          </Link>
                        </NextLink>
                      </TableCell>

                      <TableCell align="right">
                        <Typography>Rs{item.price}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => removeItemHandler(item)}
                        >
                          x
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item md={3} XS={12}>
            <Card>
              <List>
                <ListItem>
                  <Typography variant="h2">
                    Subtotal({cartItems.reduce((a, c) => a + c.quantity, 0)}{' '}
                    items) : Rs {cartItems.reduce((a, c) => a + 1 * c.price, 0)}
                  </Typography>
                </ListItem>
                <ListItem>
                  <Button
                    onClick={() => {
                      router.push('/serviceadd');
                    }}
                    fullWidth
                    color="primary"
                    variant="contained"
                  >
                    Checkout
                  </Button>
                </ListItem>
              </List>
            </Card>
          </Grid>
        </Grid>
      )}
    </Layout>
  );
}
export default dynamic(() => Promise.resolve(CartScreen), { ssr: false });
