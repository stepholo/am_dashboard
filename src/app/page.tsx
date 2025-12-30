
"use client";
import { redirect, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { initialSections } from '@/lib/constants';

export default function Home() {
  const searchParams = useSearchParams();
  const view = searchParams.get('view');

  // If there's a 'view' param, we stay on the root path to let the dashboard handle it.
  // Otherwise, we redirect to the default section.
  useEffect(() => {
    if (!view) {
      // Redirect to the default section slug.
      const defaultSection = initialSections[0]?.slug || 'payg-pipeline';
      redirect(`/${defaultSection}`);
    }
  }, [view]);

  // When a view is active, the DashboardClient will render the correct content.
  // We can return null or a loading indicator here.
  if (view) {
    return null; // Or a loading spinner
  }

  // This part will only be visible for a moment before redirecting.
  return null;
}
