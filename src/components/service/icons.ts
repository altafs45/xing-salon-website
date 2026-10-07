import {
  Award,
  BadgePercent,
  CalendarHeart,
  Camera,
  Clock,
  Crown,
  Droplets,
  Flame,
  Heart,
  Layers,
  MapPin,
  Paintbrush,
  Palette,
  Scissors,
  ShieldCheck,
  Smile,
  Sparkles,
  Star,
  Sun,
  Users,
  Waves,
  Wind,
  Zap,
  type LucideProps,
} from 'lucide-react';
import { createElement, type ComponentType } from 'react';
import type { IconKey } from '../../data/pages/types';

/** A nail outline in Lucide's style; `d` is the nail's shape on a 24px grid. */
const nail = (d: string): ComponentType<LucideProps> =>
  function NailIcon({ strokeWidth = 2, className, ...rest }: LucideProps) {
    return createElement(
      'svg',
      {
        ...rest,
        xmlns: 'http://www.w3.org/2000/svg',
        viewBox: '0 0 24 24',
        width: 24,
        height: 24,
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        className,
      },
      createElement('path', { d }),
    );
  };

/** Line icons the data files can ask for by name. */
export const ICONS: Record<IconKey, ComponentType<LucideProps>> = {
  droplets: Droplets,
  sparkles: Sparkles,
  layers: Layers,
  sun: Sun,
  clock: Clock,
  calendar: CalendarHeart,
  award: Award,
  pin: MapPin,
  offer: BadgePercent,
  shield: ShieldCheck,
  heart: Heart,
  scissors: Scissors,
  palette: Palette,
  wind: Wind,
  smile: Smile,
  star: Star,
  brush: Paintbrush,
  waves: Waves,
  flame: Flame,
  zap: Zap,
  users: Users,
  crown: Crown,
  camera: Camera,
  'nail-square': nail('M7 22V5h10v17'),
  'nail-squoval': nail('M7 22V8q0-3 3-3h4q3 0 3 3v14'),
  'nail-round': nail('M7 22V10a5 5 0 0 1 10 0v12'),
  'nail-oval': nail('M7 22V9q0-7 5-7t5 7v13'),
  'nail-almond': nail('M7 22V11q0-5 5-9 5 4 5 9v11'),
  'nail-coffin': nail('M7 22V10l2.5-7h5l2.5 7v12'),
  'nail-stiletto': nail('M7 22v-9q1-6 5-12 4 6 5 12v9'),
};
