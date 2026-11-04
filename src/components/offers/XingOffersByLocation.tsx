import { useEffect, useRef } from 'react';
import './xing-offers-by-location.css';
import { ratingLabel, salonById } from '../../data/branches';

const Arrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 12h14M13 5l7 7-7 7" />
  </svg>
);

/**
 * "Offers by Location", exactly as on the old xingsalons.com home page: each salon's own offer pages (served as
 * they were, from public/), plus AECS Layout's salon-wide offers on xingsalon.com. Only the six internal links
 * changed, to the pages' clean addresses.
 */
export function XingOffersByLocation() {
  const section = useRef<HTMLElement>(null);

  // The original reveal-on-scroll. The cards already carry "reveal in", so they show without it.
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add('in');
        });
      },
      { threshold: 0.12 },
    );
    section.current!.querySelectorAll('.reveal').forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section id="offers" className="xo-hub-scope" ref={section}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" />
      <div className="wrap">
        <div className="section-head center">
          <span className="eyebrow">LIMITED TIME</span>
          <h2>
            Offers by <span className="grad">Location</span>
          </h2>
          <p>Explore Hair Color, Hair Treatment and Skin Care offers at our HSR Layout and Sarjapur Road salons. AECS Layout, Brookefield continues with salon-wide offers.</p>
        </div>

        <div className="loc-offer-grid">
          {/* HSR Layout */}
          <div className="loc-offer-card reveal in">
            <div className="lo-top">
              <h3>HSR Layout</h3>
              <span className="lo-rating">★ {ratingLabel(salonById('hsr-layout')!.rating).replace(' ★', '')}</span>
            </div>
            <p className="lo-addr">150/3, GSR Arcade, 9th Cross, 24th Main Road, HSR Layout, Bengaluru 560102</p>
            <div className="lo-sub">
              <a className="lo-sub-link" href="/hsrhaircoloroffers">
                <span>
                  <span className="lo-tag">Hair Color</span> Offers — HSR
                </span>
                <Arrow />
              </a>
              <a className="lo-sub-link" href="/hsrhairtreatmentoffers">
                <span>
                  <span className="lo-tag">Hair Treatment</span> Offers — HSR
                </span>
                <Arrow />
              </a>
              <a className="lo-sub-link" href="/hsrskincareoffers">
                <span>
                  <span className="lo-tag">Skin Care</span> Offers — HSR
                </span>
                <Arrow />
              </a>
            </div>
            <a className="btn btn-whatsapp btn-block" href="https://wa.me/919380812348?text=Hi%21%20I%27d%20like%20to%20book%20an%20offer%20at%20Xing%20Salon%2C%20HSR%20Layout." target="_blank" rel="noopener">
              WhatsApp HSR Layout
            </a>
          </div>

          {/* Sarjapur Road */}
          <div className="loc-offer-card reveal in">
            <div className="lo-top">
              <h3>Sarjapur Road</h3>
              <span className="lo-rating">★ {ratingLabel(salonById('sarjapur-road')!.rating).replace(' ★', '')}</span>
            </div>
            <p className="lo-addr">Samvit Greens, 71/1A, Sarjapur–Marathahalli Road, Bengaluru</p>
            <div className="lo-sub">
              <a className="lo-sub-link" href="/sarjapaurahaircoloroffers">
                <span>
                  <span className="lo-tag">Hair Color</span> Offers — Sarjapur
                </span>
                <Arrow />
              </a>
              <a className="lo-sub-link" href="/sarjapurahairtreatmentoffers">
                <span>
                  <span className="lo-tag">Hair Treatment</span> Offers — Sarjapur
                </span>
                <Arrow />
              </a>
              <a className="lo-sub-link" href="/sarjapuraskincareoffers">
                <span>
                  <span className="lo-tag">Skin Care</span> Offers — Sarjapur
                </span>
                <Arrow />
              </a>
            </div>
            <a className="btn btn-whatsapp btn-block" href="https://wa.me/918970007440?text=Hi%21%20I%27d%20like%20to%20book%20an%20offer%20at%20Xing%20Salon%2C%20Sarjapur%20Road." target="_blank" rel="noopener">
              WhatsApp Sarjapur Road
            </a>
          </div>

          {/* AECS Layout, Brookefield */}
          <div className="loc-offer-card reveal in">
            <div className="lo-top">
              <h3>AECS Layout</h3>
              <span className="lo-rating">★ {ratingLabel(salonById('brookfield')!.rating).replace(' ★', '')}</span>
            </div>
            <p className="lo-addr">SV Plaza, 267, 60 Feet Road, AECS Layout, Whitefield, Bengaluru</p>
            <div className="lo-sub">
              <a className="lo-sub-link" href="https://www.xingsalon.com/hair-color-offer.html" target="_blank" rel="noopener">
                <span>
                  <span className="lo-tag">Hair Color</span> Offer — Salon-wide
                </span>
                <Arrow />
              </a>
              <a className="lo-sub-link" href="https://www.xingsalon.com/hair-treatment-offer.html" target="_blank" rel="noopener">
                <span>
                  <span className="lo-tag">Hair Treatment</span> Offer — Salon-wide
                </span>
                <Arrow />
              </a>
            </div>
            <a className="btn btn-whatsapp btn-block" href="https://wa.me/918147111344?text=Hi%21%20I%27d%20like%20to%20book%20an%20offer%20at%20Xing%20Salon%2C%20AECS%20Layout%2C%20Brookefield." target="_blank" rel="noopener">
              WhatsApp AECS Layout
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
