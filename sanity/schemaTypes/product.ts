import { defineField, defineType } from 'sanity';

export const productType = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Price in Naira (₦ NGN)',
      type: 'number',
      description: 'e.g. 25000',
      validation: (rule) => rule.required().positive(),
    }),
    defineField({
      name: 'comparePrice',
      title: 'Compare at Price (₦ NGN)',
      type: 'number',
      description: 'Original price for strikethrough sale display',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Tees', value: 'tees' },
          { title: 'Hoodies', value: 'hoodies' },
          { title: 'Bottoms', value: 'bottoms' },
          { title: 'Accessories', value: 'accessories' },
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'status',
      title: 'Status Tag',
      type: 'string',
      options: {
        list: [
          { title: 'None', value: 'none' },
          { title: 'NEW', value: 'NEW' },
          { title: 'LIMITED', value: 'LIMITED' },
          { title: 'SOLD OUT', value: 'SOLD OUT' },
        ],
        layout: 'radio',
      },
      initialValue: 'NEW',
    }),
    defineField({
      name: 'isFeatured',
      title: 'Featured on Homepage (The Latest Drop)',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'isCollabSpotlight',
      title: 'Collab / Editor Spotlight (e.g. Motion Abuja Edition)',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'colorway',
      title: 'Colorway Name',
      type: 'string',
      description: 'e.g. Jet Black, Crimson Red, Nude, Earthy Green, Hot Pepper',
    }),
    defineField({
      name: 'colorHex',
      title: 'Colorway Swatch Hex',
      type: 'string',
      description: 'e.g. #090A0E or #760504',
    }),
    defineField({
      name: 'sizes',
      title: 'Available Sizes',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'ONE SIZE'],
      },
      initialValue: ['S', 'M', 'L', 'XL', 'XXL'],
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Product Photo (Front)',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'secondaryImage',
      title: 'Secondary Photo (Back Graphic / Artwork Detail)',
      type: 'image',
      description: 'Revealed on card hover flip',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'gallery',
      title: 'Additional Lookbook / Detail Photos',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),
    defineField({
      name: 'description',
      title: 'Product Story & Details',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'materialDetails',
      title: 'Fabric & Specifications',
      type: 'string',
      description: 'e.g. 240gsm heavyweight cotton, drop shoulder boxy fit, fleece-lined',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      price: 'price',
      status: 'status',
      media: 'mainImage',
    },
    prepare({ title, price, status, media }) {
      return {
        title,
        subtitle: `₦${Number(price).toLocaleString()} · [${status || 'REGULAR'}]`,
        media,
      };
    },
  },
});
