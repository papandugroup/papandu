import { defineField, defineType } from 'sanity';

export const dropType = defineType({
  name: 'drop',
  title: 'Seasonal Drop',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Drop Title',
      type: 'string',
      description: 'e.g. DROP 001: TRIBE OF ONE',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'seasonTag',
      title: 'Season / Campaign Tag',
      type: 'string',
      description: 'e.g. FW26 / LAUNCH COLLECTION',
    }),
    defineField({
      name: 'storyHeadline',
      title: 'Story Headline',
      type: 'string',
      description: 'e.g. Limited pieces. Compelling stories. When it’s gone, it’s gone.',
    }),
    defineField({
      name: 'launchDate',
      title: 'Launch Date & Time',
      type: 'datetime',
      description: 'Used for the countdown timer on the shop and home page',
    }),
    defineField({
      name: 'countdownActive',
      title: 'Is Countdown Active?',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'bannerImage',
      title: 'Drop Campaign Hero Banner',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
  ],
});
