import { CategoriesClient } from './components/CategoriesClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Categories | Vendora',
  description:
    'Browse products by category on Vendora - find everything you need for your home, office, or personal use.',
};

export default function CategoriesPage() {
  return <CategoriesClient />;
}
