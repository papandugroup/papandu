'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, Trash2, Plus, Minus, Lock, ArrowRight, Truck } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { triggerPaystackCheckout } from '@/lib/paystack';
import { StarIcon } from './StarIcon';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    formatPrice,
    cartTotalNGN,
    freeShippingThresholdNGN,
    setOrderSuccess,
  } = useStore();

  const [customerEmail, setCustomerEmail] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [formError, setFormError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isCartOpen) return null;

  const progressPercent = Math.min(100, Math.round((cartTotalNGN / freeShippingThresholdNGN) * 100));
  const remainingForFreeShipping = Math.max(0, freeShippingThresholdNGN - cartTotalNGN);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!customerEmail || !customerEmail.includes('@')) {
      setFormError('Please provide a valid email address for your Paystack receipt.');
      return;
    }
    if (!customerName.trim()) {
      setFormError('Please enter your full name.');
      return;
    }

    setIsProcessing(true);

    triggerPaystackCheckout({
      email: customerEmail,
      name: customerName,
      phone: customerPhone,
      deliveryAddress,
      amountNGN: cartTotalNGN,
      items: cart,
      onSuccess: (reference: string) => {
        setIsProcessing(false);
        const orderSummary = {
          reference,
          customerEmail,
          totalFormatted: formatPrice(cartTotalNGN),
          items: [...cart],
        };

        // Dispatch Resend confirmation email asynchronously
        fetch('/api/orders/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            reference,
            customerName,
            customerEmail,
            customerPhone,
            deliveryAddress,
            totalFormatted: formatPrice(cartTotalNGN),
            items: cart.map((i) => ({
              title: i.product.title,
              size: i.size,
              quantity: i.quantity,
              price: i.product.price,
              colorway: i.product.colorway,
              image: i.product.mainImage,
            })),
          }),
        }).catch((err) => console.error('Order email dispatch error:', err));

        clearCart();
        closeCart();
        setOrderSuccess(orderSummary);
      },
      onCancel: () => {
        setIsProcessing(false);
      },
    });
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        justifyContent: 'flex-end',
      }}
    >
      {/* Backdrop */}
      <div
        onClick={closeCart}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(5, 6, 8, 0.75)',
          backdropFilter: 'blur(8px)',
        }}
      />

      {/* Slide-out Drawer Panel */}
      <div
        data-lenis-prevent
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '460px',
          height: '100%',
          backgroundColor: '#FFFFFF',
          borderLeft: '1px solid rgba(9, 10, 14, 0.12)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 10,
          boxShadow: '-10px 0 40px rgba(0, 0, 0, 0.8)',
          animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >

        {/* Drawer Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid rgba(9, 10, 14, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <StarIcon size={16} color="var(--papandu-red)" />
            <h2 style={{ fontSize: '1.4rem', margin: 0 }}>YOUR TRIBE BAG ({cart.length})</h2>
          </div>
          <button onClick={closeCart} style={{ color: 'var(--papandu-black)', padding: '4px' }}>
            <X size={22} />
          </button>
        </div>

        {/* Free Shipping Progress Bar */}
        <div style={{ padding: '14px 24px', backgroundColor: '#EDE6DC', borderBottom: '1px solid rgba(9, 10, 14, 0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
            <Truck size={16} color={progressPercent === 100 ? 'var(--papandu-red)' : 'var(--papandu-black)'} />
            <span>
              {progressPercent === 100
                ? 'FREE LAGOS DELIVERY UNLOCKED!'
                : `Add ${formatPrice(remainingForFreeShipping)} more for FREE Lagos delivery`}
            </span>
          </div>
          <div style={{ width: '100%', height: '4px', backgroundColor: '#DDD5CB', borderRadius: '2px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${progressPercent}%`,
                height: '100%',
                backgroundColor: progressPercent === 100 ? 'var(--papandu-gold)' : 'var(--papandu-red)',
                transition: 'width 0.4s ease',
              }}
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
                <StarIcon size={40} color="#9B9285" />
              </div>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--papandu-black)', marginBottom: '8px' }}>Your bag is empty</h3>
              <p style={{ color: '#6B6459', fontSize: '0.9rem', marginBottom: '24px' }}>
                The latest drop is live. Don't sleep on exclusive pieces.
              </p>
              <button
                onClick={closeCart}
                className="btn-primary"
                style={{ padding: '10px 20px', fontSize: '0.95rem' }}
              >
                EXPLORE THE DROP
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {cart.map((item) => (
                <div
                  key={`${item.product.id}-${item.size}`}
                  style={{
                    display: 'flex',
                    gap: '14px',
                    paddingBottom: '16px',
                    borderBottom: '1px solid rgba(9, 10, 14, 0.06)',
                  }}
                >
                  <div
                    style={{
                      width: '72px',
                      height: '90px',
                      position: 'relative',
                      flexShrink: 0,
                      backgroundColor: '#EDE6DC',
                      borderRadius: '2px',
                      overflow: 'hidden',
                    }}
                  >
                    <Image
                      src={item.product.mainImage}
                      alt={item.product.title}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>

                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <h4 style={{ fontSize: '1rem', lineHeight: 1.2, color: 'var(--papandu-black)' }}>
                          {item.product.title}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.product.id, item.size)}
                          style={{ color: '#6B6459', padding: '2px' }}
                          title="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <p style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: '#6B6459', marginTop: '4px' }}>
                        SIZE: <span style={{ color: 'var(--papandu-red)' }}>{item.size}</span> · {item.product.colorway}
                      </p>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          border: '1px solid rgba(9, 10, 14, 0.15)',
                          borderRadius: '2px',
                        }}
                      >
                        <button
                          onClick={() => updateQuantity(item.product.id, item.size, -1)}
                          style={{ padding: '4px 8px', color: 'var(--papandu-black)' }}
                        >
                          <Minus size={12} />
                        </button>
                        <span style={{ padding: '0 8px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.size, 1)}
                          style={{ padding: '4px 8px', color: 'var(--papandu-black)' }}
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.95rem' }}>
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer & Paystack Checkout Form */}
        {cart.length > 0 && (
          <div
            style={{
              padding: '20px 24px',
              backgroundColor: '#FFFFFF',
              borderTop: '1px solid rgba(9, 10, 14, 0.1)',
            }}
          >
            {/* Customer Inputs for Paystack Checkout */}
            <form onSubmit={handleCheckout}>
              {formError && (
                <div
                  style={{
                    backgroundColor: 'rgba(118, 5, 4, 0.2)',
                    border: '1px solid var(--papandu-red)',
                    color: 'var(--papandu-maroon-dark)',
                    padding: '8px 12px',
                    borderRadius: '2px',
                    fontSize: '0.78rem',
                    marginBottom: '12px',
                  }}
                >
                  {formError}
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                <input
                  type="text"
                  placeholder="Full Name *"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    backgroundColor: '#EDE6DC',
                    border: '1px solid rgba(9, 10, 14, 0.12)',
                    color: 'var(--papandu-black)',
                    fontSize: '0.85rem',
                    borderRadius: '2px',
                    fontFamily: 'var(--font-mono)',
                  }}
                  required
                />
                <input
                  type="email"
                  placeholder="Email Address (for Paystack receipt) *"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    backgroundColor: '#EDE6DC',
                    border: '1px solid rgba(9, 10, 14, 0.12)',
                    color: 'var(--papandu-black)',
                    fontSize: '0.85rem',
                    borderRadius: '2px',
                    fontFamily: 'var(--font-mono)',
                  }}
                  required
                />
                <input
                  type="tel"
                  placeholder="Phone Number (optional)"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    backgroundColor: '#EDE6DC',
                    border: '1px solid rgba(9, 10, 14, 0.12)',
                    color: 'var(--papandu-black)',
                    fontSize: '0.85rem',
                    borderRadius: '2px',
                    fontFamily: 'var(--font-mono)',
                  }}
                />
                <input
                  type="text"
                  placeholder="Delivery Address / City (optional)"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    backgroundColor: '#EDE6DC',
                    border: '1px solid rgba(9, 10, 14, 0.12)',
                    color: 'var(--papandu-black)',
                    fontSize: '0.85rem',
                    borderRadius: '2px',
                    fontFamily: 'var(--font-mono)',
                  }}
                />
              </div>

              {/* Subtotal & Totals */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span style={{ color: '#6B6459', fontSize: '0.9rem' }}>Subtotal</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '1.2rem', color: 'var(--papandu-black)' }}>
                  {formatPrice(cartTotalNGN)}
                </span>
              </div>

              {/* Paystack Pay Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="btn-gold"
                style={{ width: '100%', padding: '14px', fontSize: '1.1rem' }}
              >
                {isProcessing ? (
                  <span>LAUNCHING PAYSTACK...</span>
                ) : (
                  <>
                    <Lock size={16} />
                    <span>PAY WITH PAYSTACK</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '10px' }}>
                <span style={{ fontSize: '0.7rem', color: '#6B6459', fontFamily: 'var(--font-mono)' }}>
                  SECURED BY PAYSTACK · CARDS, USSD & TRANSFER
                </span>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
