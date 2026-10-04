/**
 * No approved testimonials exist yet. The Success Stories page renders an
 * honest, aspirational empty state while this remains empty; once real,
 * approved testimonials are available, add them here and the page will
 * render them automatically.
 */
export type Testimonial = {
  studentName: string;
  destination: string;
  university?: string;
  course?: string;
  quote: string;
  photoUrl?: string;
};

export const testimonials: Testimonial[] = [];
