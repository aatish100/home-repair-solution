// First, we must import the schema creator
import createSchema from 'part:@sanity/base/schema-creator';

// Then import schema types from any plugins that might expose them
import schemaTypes from 'all:part:@sanity/base/schema-type';
import serviceman from './serviceman';
import user from './user';
import servicebooking from './servicebooking';
import bookservices from './bookservices';
import paymentResult from './paymentResult';
import serviceAddress from './serviceAddress';

// Then we give our schema to the builder and provide the result to Sanity
export default createSchema({
  // We name our schema
  name: 'default',
  // Then proceed to concatenate our document type
  // to the ones provided by any plugins that are installed
  types: schemaTypes.concat([
    /* Your types here! */
    serviceman,
    user,
    servicebooking,
    bookservices,
    paymentResult,
    serviceAddress,
  ]),
});
