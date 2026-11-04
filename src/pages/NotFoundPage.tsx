import { Button } from '../components/ui/Button';
import { Eyebrow } from '../components/ui/Primitives';
import { notFound } from '../data/notFound';
import { offersPath } from '../data/offers';
import { servicesHubPath } from '../data/services';

/** Shown for an address no page answers to. The build also writes it to 404.html for the host to serve. */
export default function NotFoundPage() {
  return (
    <section className="bg-blush pt-header-sm lg:pt-header">
      <div className="container-site flex min-h-[70svh] flex-col items-start justify-center py-14">
        <Eyebrow>Error 404</Eyebrow>
        <h1 className="mt-3 font-display text-hero font-medium text-ink">{notFound.h1}</h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-muted sm:text-base">{notFound.text}</p>
        <div className="mt-6 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Button href="/">Back to Home</Button>
          <Button variant="outline" href={servicesHubPath} arrow={false}>
            Our Services
          </Button>
          <Button variant="outline" href={offersPath} arrow={false}>
            Current Offers
          </Button>
        </div>
      </div>
    </section>
  );
}
