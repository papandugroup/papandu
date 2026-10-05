import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    // 1. Check Edge headers (Vercel, Cloudflare, standard reverse proxies)
    const headerCountry =
      req.headers.get('x-vercel-ip-country') ||
      req.headers.get('cf-ipcountry') ||
      req.headers.get('x-country-code') ||
      req.headers.get('geo-country');

    let countryCode = headerCountry ? headerCountry.toUpperCase() : null;

    // 2. If no edge header exists (e.g. localhost, local dev, or standard hosting),
    // perform a fast server-side fallback lookup with a short timeout.
    if (!countryCode || countryCode === 'XX') {
      try {
        const clientIp =
          req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
          req.headers.get('x-real-ip');

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 2000);

        const url = clientIp && clientIp !== '::1' && clientIp !== '127.0.0.1'
          ? `https://api.country.is/${clientIp}`
          : 'https://api.country.is';

        const res = await fetch(url, {
          signal: controller.signal,
          headers: { 'User-Agent': 'Papandu-Store-Geo/1.0' },
          next: { revalidate: 3600 },
        });

        clearTimeout(timeout);

        if (res.ok) {
          const data = await res.json();
          if (data && data.country) {
            countryCode = data.country.toUpperCase();
          }
        }
      } catch (err) {
        // Fallback gracefully on timeout/error
      }
    }

    // 3. Map country code to supported store currencies:
    // NG -> NGN
    // GB/UK -> GBP
    // All other international regions -> USD
    let currency: 'NGN' | 'GBP' | 'USD' = 'NGN';

    if (countryCode === 'NG') {
      currency = 'NGN';
    } else if (countryCode === 'GB' || countryCode === 'UK') {
      currency = 'GBP';
    } else if (countryCode) {
      currency = 'USD';
    }

    return NextResponse.json({
      country: countryCode || 'NG',
      currency,
    });
  } catch (error) {
    return NextResponse.json({
      country: 'NG',
      currency: 'NGN',
    });
  }
}
