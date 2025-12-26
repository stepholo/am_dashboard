import { redirect } from 'next/navigation';
import { SECTIONS } from '@/lib/constants';

export default function Home() {
  // Redirect to the first section by default.
  // The dashboard layout will handle authentication.
  redirect(`/${SECTIONS[0].slug}`);
}
