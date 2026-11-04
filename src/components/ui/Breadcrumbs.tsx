import { ChevronRight } from 'lucide-react';

/** The visible breadcrumb. Matches the page's BreadcrumbList schema. */
export function Breadcrumbs({ trail, current }: { trail: Array<{ label: string; href: string }>; current: string }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-muted">
        {trail.map((crumb) => (
          <li key={crumb.href} className="flex items-center gap-1">
            <a href={crumb.href} className="inline-flex min-h-11 min-w-11 items-center underline-offset-4 hover:text-berry hover:underline">
              {crumb.label}
            </a>
            <ChevronRight aria-hidden className="size-4" />
          </li>
        ))}
        <li aria-current="page" className="font-medium text-ink">
          {current}
        </li>
      </ol>
    </nav>
  );
}
