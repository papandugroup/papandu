import React from 'react';
import { Landmark, Smartphone } from 'lucide-react';

/**
 * The acceptance-mark row under the checkout button.
 *
 * Brand marks are real vendored SVGs (see public/payment/README.md) — never
 * redrawn approximations, since a slightly-wrong Visa or Apple Pay mark
 * misrepresents the brand and reads as counterfeit.
 *
 * Bank transfer and USSD have no trademark to show: they're payment *methods*,
 * not networks, so those two use in-house icons drawn in the site's own style.
 */
type PaymentMethod =
  | { kind: 'mark'; label: string; src: string; fills: boolean }
  | { kind: 'icon'; label: string; Icon: typeof Landmark };

const PAYMENT_METHODS: PaymentMethod[] = [
  // `fills: true` = the artwork carries its own card background edge-to-edge,
  // so it shouldn't be inset inside the tile.
  { kind: 'mark', label: 'Visa', src: '/payment/visa.svg', fills: true },
  { kind: 'mark', label: 'Mastercard', src: '/payment/mastercard.svg', fills: true },
  { kind: 'mark', label: 'Apple Pay', src: '/payment/apple-pay.svg', fills: false },
  { kind: 'icon', label: 'Bank transfer', Icon: Landmark },
  { kind: 'icon', label: 'USSD', Icon: Smartphone },
];

export const PaymentMethods: React.FC = () => {
  return (
    <div className="pay-row">
      <ul className="pay-marks" aria-label="Accepted payment methods">
        {PAYMENT_METHODS.map((method) => (
          <li
            key={method.label}
            className={`pay-tile${method.kind === 'mark' && method.fills ? ' pay-tile-bleed' : ''}`}
            title={method.label}
          >
            {method.kind === 'mark' ? (
              // Plain <img>: these are tiny static SVGs, and Next's image
              // optimiser doesn't process SVG anyway. Deliberately NOT lazy —
              // lazy-loading inside the fixed, transformed drawer left them
              // permanently unloaded, and a trust mark under the pay button
              // has to be visible the moment the drawer opens.
              // eslint-disable-next-line @next/next/no-img-element
              <img src={method.src} alt={method.label} width={38} height={24} decoding="async" />
            ) : (
              <>
                <method.Icon size={15} aria-hidden="true" />
                <span className="sr-only">{method.label}</span>
              </>
            )}
          </li>
        ))}
      </ul>

      <span className="pay-note">Secured by Paystack · Verve cards accepted</span>
    </div>
  );
};

export default PaymentMethods;
