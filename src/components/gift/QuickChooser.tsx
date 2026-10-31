import { ChevronRight, Gift, Sparkles } from 'lucide-react';
import { gmPage } from '../../data/giftMembership';
import { track } from '../../lib/analytics';
import { scrollToId } from './shared';

export type Choice = 'gift' | 'membership';

/** Two doors: gifting someone, or treating yourself. Picking one scrolls there and sets the comparison's pick. */
export function QuickChooser({ onChoose }: { onChoose: (choice: Choice) => void }) {
  const { chooser } = gmPage;
  const doors = [
    { choice: 'gift' as const, target: 'gift-cards', Icon: Gift, ...chooser.gift },
    { choice: 'membership' as const, target: 'membership', Icon: Sparkles, ...chooser.self },
  ];
  return (
    <section id="choose" aria-labelledby="choose-title" className="bg-cream pb-12 pt-2 lg:pb-16">
      <div className="container-site">
        <h2 id="choose-title" className="heading text-balance text-center text-ink">
          {chooser.title}
        </h2>
        <ul className="mx-auto mt-6 grid max-w-4xl gap-3 sm:grid-cols-2 sm:gap-5">
          {doors.map(({ choice, target, Icon, title, text, cta }) => (
            <li key={choice}>
              <button
                type="button"
                onClick={() => {
                  track('gm_chooser_select', { choice });
                  onChoose(choice);
                  scrollToId(target);
                }}
                className="group flex min-h-[4.5rem] w-full items-center gap-4 rounded-3xl border border-berry/15 bg-white p-4 text-left shadow-soft transition duration-200 hover:border-berry/40 hover:shadow-lift motion-reduce:transition-none sm:p-6"
              >
                <span className="grid size-12 shrink-0 place-items-center rounded-full bg-blush text-berry">
                  <Icon aria-hidden className="size-6" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-2xl font-medium leading-tight text-ink">{title}</span>
                  <span className="mt-1 block text-base text-muted">{text}</span>
                  <span className="mt-2 block text-base font-semibold text-berry md:text-sm">{cta}</span>
                </span>
                <ChevronRight aria-hidden className="size-6 shrink-0 text-berry transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
