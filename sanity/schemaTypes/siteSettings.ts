import { defineField, defineType } from 'sanity';

export const siteSettingsType = defineType({
  name: 'siteSettings',
  title: 'Site Settings & Ticker',
  type: 'document',
  fields: [
    defineField({
      name: 'announcementTicker',
      title: 'Top Announcement Bar Marquee Items',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Messages scrolling continuously at the very top of the site',
      initialValue: [
        'FREE DELIVERY IN LAGOS ON ORDERS OVER ₦50,000',
        'WORLDWIDE SHIPPING: WEST AFRICA · UK · NORTH AMERICA',
        'DROP 001 IS NOW LIVE — TRIBE OF ONE',
        'SECRET DROPS GO TO THE OGS FIRST — JOIN THE TRIBE',
      ],
    }),
    defineField({
      name: 'whatsappNumber',
      title: 'WhatsApp Contact Number',
      type: 'string',
      initialValue: '+234 811 121 0706',
    }),
    defineField({
      name: 'instagramHandle',
      title: 'Instagram Handle',
      type: 'string',
      initialValue: '@papandu.star',
    }),
    defineField({
      name: 'studioAddress',
      title: 'Showroom / Studio Address',
      type: 'string',
      initialValue: 'Victoria Island, Lagos, Nigeria',
    }),
  ],
});
