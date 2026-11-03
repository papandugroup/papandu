import { markItemsAsSold } from '@/lib/inventory';

// Define the inventory keys for the three sold out items
// Format: ${productSlug}::${slugifiedColorway}
// Product slug: for-the-stars-signature-stripe-shirt
const soldOutItems = [
  'for-the-stars-signature-stripe-shirt::ivory-oversized',
  'for-the-stars-signature-stripe-shirt::steel-blue-stripe',
  'for-the-stars-signature-stripe-shirt::mauve-pinstripe',
  'for-the-stars-signature-stripe-shirt::navy-burgundy-pinstripe'
];

// Mark these items as sold out
// Using a placeholder order reference since this is being done manually for display purposes
markItemsAsSold(soldOutItems, 'MANUAL_MARK_SOLD_OUT_DISPLAY_ONLY')
  .then(() => {
    console.log('Successfully marked items as sold out');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error marking items as sold out:', error);
    process.exit(1);
  });