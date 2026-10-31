import { locations } from '../data/branches';

/** Desktop only: every salon's number, above the header. Written into the HTML at build time, in the page's flow. */
export function UtilityBar() {
  return (
    <div data-utility-bar className="hidden h-8 items-center bg-berrydark text-xs text-cream lg:flex">
      <ul className="container-site flex items-center justify-end gap-6">
        {locations.map((loc) => (
          <li key={loc.id}>
            {loc.name}{' '}
            <a href={loc.phoneHref} className="font-medium hover:underline">
              {loc.phone}
            </a>
          </li>
        ))}
        <li>Open daily</li>
      </ul>
    </div>
  );
}
