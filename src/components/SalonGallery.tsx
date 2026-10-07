import { useBooking } from '../context/booking';
import { gallery, locations } from '../data/content';
import { Button } from './ui/Button';
import { Picture, Reveal, SectionIntro } from './ui/Primitives';

// The gallery shows the salon whose interiors set the look of the site.
const salon = locations[0];

export function SalonGallery() {
  const booking = useBooking();

  return (
    <section id="gallery" className="section bg-cream">
      <div className="container-site grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-8">
        <SectionIntro eyebrow={gallery.eyebrow} title={gallery.title} text={gallery.text} className="lg:col-span-4">
          <Button onClick={() => booking.open('', salon.name)}>{gallery.cta}</Button>
        </SectionIntro>

        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:col-span-8 lg:gap-4">
          {salon.photos.map((photo, i) => (
            <li key={photo.src}>
              <Reveal delay={i * 0.06} className="group overflow-hidden rounded-card shadow-soft">
                <Picture
                  image={photo}
                  className="aspect-photo w-full object-cover transition-transform duration-700 group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                />
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
