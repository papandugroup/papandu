# Payment acceptance marks

Third-party trademarks, vendored here so the cart drawer can show the methods we
actually accept. They belong to their respective owners and are used only as
acceptance marks — don't restyle, recolour or distort them.

| File | Mark | Source |
|---|---|---|
| `visa.svg` | Visa (official blue acceptance tile, `#1434CB`) | `aaronfagan/svg-credit-card-payment-icons` (`flat/visa.svg`) |
| `mastercard.svg` | Mastercard (official `#EB001B` / `#F79E1B` / `#FF5A00` on `#253747`) | `aaronfagan/svg-credit-card-payment-icons` (`flat/mastercard.svg`) |
| `apple-pay.svg` | Apple Pay wordmark, monochrome — which is Apple's own spec for the mark | `simple-icons` (`icons/applepay.svg`, MIT-packaged) |

All three were scanned for `<script>`, event handlers and external references
before being committed — they contain none, only `<path>` geometry.

## Missing: Verve

Interswitch's Verve mark isn't available from any reputable free host (Wikimedia
only carries the band/record-label "Verve"), and verveinternational.com wasn't
reachable. Rather than approximate a trademark, Verve is credited in the caption
text instead.

To finish the row: drop the official `verve.svg` here and add one entry to
`PAYMENT_METHODS` in `src/components/PaymentMethods.tsx`.
