import { defineField, defineType } from 'sanity';

export const lookbookType = defineType({
  name: 'lookbook',
  title: 'Lookbook & Community UGC',
  type: 'document',
  fields: [
    defineField({
      name: 'caption',
      title: 'Caption / Story',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'contributor',
      title: 'Ambassador / Creator Name',
      type: 'string',
      description: 'e.g. Tunde O. · Lagos Island',
    }),
    defineField({
      name: 'instagramHandle',
      title: 'Instagram Handle',
      type: 'string',
      description: 'e.g. @tunde_creatives',
    }),
    defineField({
      name: 'image',
      title: 'Editorial / Street-style Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'taggedProduct',
      title: 'Tagged Piece',
      type: 'reference',
      to: [{ type: 'product' }],
    }),
  ],
});
