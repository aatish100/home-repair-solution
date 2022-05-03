import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from '@mui/material';
import NextLink from 'next/link';
import React from 'react';
import { urlForThumbnail } from '../utils/image';

export default function ServicemanItem({
  serviceman,
  addServiceToCartHandler,
}) {
  return (
    <Card>
      <NextLink href={`/serviceman/${serviceman.slug.current}`} passHref>
        <CardActionArea>
          <CardMedia
            component="img"
            image={urlForThumbnail(serviceman.image)}
            title={serviceman.name}
          ></CardMedia>
          <CardContent>
            <Typography>{serviceman.name}</Typography>
            <Rating value={serviceman.rating} readOnly></Rating>
          </CardContent>
        </CardActionArea>
      </NextLink>
      <CardActions>
        <Typography>Rs{serviceman.price}</Typography>
        <Button
          size="small"
          color="primary"
          onClick={() => addServiceToCartHandler(serviceman)}
        >
          Add Service To Cart
        </Button>
      </CardActions>
    </Card>
  );
}
