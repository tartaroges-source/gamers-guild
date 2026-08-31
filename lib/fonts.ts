import { Montserrat, Yellowtail } from 'next/font/google';

// Bacony Script (used for the IGN nickname on the ID card) isn't a
// licensed web font we have rights to embed — Yellowtail is the closest
// free, similarly bold brush-script alternative available on Google Fonts.
export const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-montserrat',
});

export const yellowtail = Yellowtail({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-yellowtail',
});