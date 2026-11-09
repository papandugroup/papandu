'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import { StarIcon } from '@/components/StarIcon';
import { CheckCircle2, AlertCircle, Loader2, ArrowRight } from 'lucide-react';

function CheckoutCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { clearCart, setOrderSuccess, refreshInventory, formatPrice } = useStore();

  const [status, setStatus] = useState<'verifying' | 'success' | 'failed'>('verifying');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [orderInfo, setOrderInfo] = useState<{
    reference: string;
    email: string;
    total: string;
  } | null>(null);

  useEffect(() => {
    const reference = searchParams.get('reference') || searchParams.get('trxref');

    if (!reference) {
      setStatus('failed');
      setErrorMessage('No payment reference found. Please contact support if you were debited.');
      return;
    }

    const ref = reference;

    async function verifyPayment() {
      try {
        const verifyRes = await fetch('/api/paystack/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reference: ref }),
        });

        const verifyData = await verifyRes.json();

        if (verifyData.success && verifyData.data?.status === 'success') {
          const txData = verifyData.data;
          const email = txData.customer?.email || '';
          const customFields = txData.metadata?.custom_fields || [];
          const name = customFields.find((f: any) => f.variable_name === 'customer_name')?.value || email;
          const phone = customFields.find((f: any) => f.variable_name === 'phone_number')?.value || '';
          const deliveryAddress = customFields.find((f: any) => f.variable_name === 'delivery_address')?.value || '';
          const totalAmountNGN = (txData.amount || 0) / 100;
          const formattedTotal = formatPrice(totalAmountNGN);

          setOrderInfo({
            reference: ref,
            email,
            total: formattedTotal,
          });

          // Trigger Confetti
          try {
            const confettiModule = await import('canvas-confetti');
            const confetti = confettiModule.default || confettiModule;
            confetti({
              particleCount: 100,
              spread: 80,
              origin: { y: 0.6 },
              colors: ['#FBDC6A', '#760504', '#00057D', '#E2D9D2'],
            });
          } catch {}

          // Send confirmation email asynchronously via Resend
          fetch('/api/orders/confirm', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              reference: ref,
              customerName: name,
              customerEmail: email,
              customerPhone: phone,
              deliveryAddress,
              totalFormatted: formattedTotal,
              items: txData.metadata?.items || [],
            }),
          }).catch((e) => console.error('Order confirm call error:', e));

          // Clear local cart and refresh inventory
          clearCart();
          await refreshInventory();

          setOrderSuccess({
            reference: ref,
            customerEmail: email,
            totalFormatted: formattedTotal,
            items: [],
          });

          setStatus('success');
        } else {
          setStatus('failed');
          setErrorMessage(verifyData.message || 'Payment could not be verified by Paystack.');
        }
      } catch (err: any) {
        console.error('Verification error:', err);
        setStatus('failed');
        setErrorMessage('A network error occurred while verifying your payment. Please refresh or contact support.');
      }
    }

    verifyPayment();
  }, [searchParams, clearCart, setOrderSuccess, refreshInventory, formatPrice]);

  return (
    <div
      style={{
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 16px',
        backgroundColor: 'var(--papandu-cream)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '520px',
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--papandu-gold)',
          borderRadius: '4px',
          padding: '36px 28px',
          textAlign: 'center',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.08)',
        }}
      >
        {status === 'verifying' && (
          <div style={{ padding: '24px 0' }}>
            <Loader2
              size={40}
              className="animate-spin"
              style={{ margin: '0 auto 20px', color: 'var(--papandu-gold)' }}
            />
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.4rem',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: 'var(--papandu-black)',
                marginBottom: '8px',
              }}
            >
              Verifying Your Payment
            </h2>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#6B6459' }}>
              Confirming transaction with Paystack... Please do not close this window.
            </p>
          </div>
        )}

        {status === 'success' && (
          <div>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'rgba(118, 5, 4, 0.08)',
                border: '1px solid var(--papandu-red)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
              }}
            >
              <CheckCircle2 size={34} color="var(--papandu-red)" />
            </div>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                backgroundColor: 'rgba(191, 163, 118, 0.1)',
                border: '1px solid var(--papandu-gold)',
                borderRadius: '2px',
                marginBottom: '16px',
              }}
            >
              <StarIcon size={11} color="var(--papandu-gold)" />
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'var(--papandu-black)',
                }}
              >
                TRIBE OF ONE · ORDER SECURED
              </span>
            </div>

            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.8rem',
                lineHeight: 1.1,
                color: 'var(--papandu-black)',
                marginBottom: '12px',
              }}
            >
              PAYMENT CONFIRMED
            </h1>

            <p style={{ fontSize: '0.9rem', color: '#6B6459', lineHeight: 1.6, marginBottom: '24px' }}>
              Your piece has been secured from the <strong style={{ color: 'var(--papandu-black)' }}>&quot;For The Stars&quot;</strong> archive. Our Lagos atelier is preparing your garment.
            </p>

            {orderInfo && (
              <div
                style={{
                  backgroundColor: '#FAF8F5',
                  border: '1px solid rgba(9, 10, 14, 0.08)',
                  borderRadius: '2px',
                  padding: '16px',
                  marginBottom: '28px',
                  textAlign: 'left',
                  fontSize: '0.8rem',
                  fontFamily: 'var(--font-mono)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#8E8A82' }}>Order Ref:</span>
                  <strong style={{ color: 'var(--papandu-black)' }}>{orderInfo.reference}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#8E8A82' }}>Total Paid:</span>
                  <strong style={{ color: 'var(--papandu-red)' }}>{orderInfo.total}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#8E8A82' }}>Receipt To:</span>
                  <span style={{ color: 'var(--papandu-black)' }}>{orderInfo.email}</span>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link
                href="/shop"
                className="btn-primary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '14px',
                  textDecoration: 'none',
                  fontSize: '0.95rem',
                }}
              >
                <span>CONTINUE SHOPPING</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        )}

        {status === 'failed' && (
          <div>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'rgba(118, 5, 4, 0.08)',
                border: '1px solid var(--papandu-red)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
              }}
            >
              <AlertCircle size={34} color="var(--papandu-red)" />
            </div>

            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.6rem',
                color: 'var(--papandu-black)',
                marginBottom: '10px',
              }}
            >
              Verification Issue
            </h1>

            <p style={{ fontSize: '0.88rem', color: '#6B6459', lineHeight: 1.6, marginBottom: '24px' }}>
              {errorMessage || 'We could not verify your payment at this time.'}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link
                href="/shop"
                className="btn-primary"
                style={{
                  display: 'block',
                  padding: '14px',
                  textDecoration: 'none',
                  textAlign: 'center',
                }}
              >
                RETURN TO SHOP
              </Link>
              <Link
                href="/contact"
                style={{
                  fontSize: '0.8rem',
                  fontFamily: 'var(--font-mono)',
                  color: '#6B6459',
                  textDecoration: 'underline',
                  padding: '6px',
                }}
              >
                Contact PAPANDU Support
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CheckoutCallbackPage() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: '#6B6459' }}>
            Loading checkout status...
          </p>
        </div>
      }
    >
      <CheckoutCallbackContent />
    </Suspense>
  );
}
