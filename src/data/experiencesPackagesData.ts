// src/data/experiencesPackagesData.ts
export interface ExperiencePackage {
  id: string;
  type: 'home' | 'package';
  title: string;
  mainBg: string; 
  subtitle?: string;
  price?: number;
  description?: string;
  features?: string[];
  internalBgs?: string[]; 
  category: string;
}

export const experiencesPackagesData: ExperiencePackage[] = [
  {
    id: 's0', type: 'home', title: 'Elevate Your Stay',
    mainBg: '/assets/experiencespackages/s0.jpg', category: 'All'
  },
  {
    id: 's1', type: 'package', title: 'Gold Package', subtitle: 'Curated Day-out experience', price: 4800,
    description: 'Indulge in a luxurious couples spa experience with aromatherapy and relaxation techniques.',
    features: ['Welcome drink, Buffet Lunch, Hi-tea, Dinner', 'Aromatherapy session', 'All Indoor and Outdoor Activities'],
    category: 'Day out Package', mainBg: '/assets/experiencespackages/s1.png',
    internalBgs: ['/assets/experiencespackages/day-out-packages/s0.png', '/assets/experiencespackages/day-out-packages/s1.png', '/assets/experiencespackages/day-out-packages/s2.png']
  },
  {
    id: 's2', type: 'package', title: 'Candlelight Dinner', subtitle: '2-3 hours', price: 3800,
    description: 'An intimate dining experience under the stars with live music and personalized menu.',
    features: ['Private rooftop setup', '5-course menu', 'Live music'],
    category: 'Dining', mainBg: '/assets/experiencespackages/s2.png',
    internalBgs: ['/assets/experiencespackages/s2.png', '/assets/experiencespackages/day-out-packages/s1.png', '/assets/experiencespackages/day-out-packages/s2.png']
  },
  {
    id: 's3', type: 'package', title: 'Rock the Season', subtitle: '2 nights / 3 days', price: 23499,
    mainBg: '/assets/experiencespackages/s3.png', category: 'Rooms Package'
  }
];