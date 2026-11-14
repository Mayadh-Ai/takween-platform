import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, messages } from "@/lib/i18n";

type LocalizedPageProps = {
  params: Promise<{ locale: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ar" }];
}

export async function generateMetadata({
  params,
}: LocalizedPageProps): Promise<Metadata> {
  const { locale: requestedLocale } = await params;
  if (!isLocale(requestedLocale)) notFound();

  const copy = messages[requestedLocale];
  return {
    title: copy.metaTitle,
    description: copy.metaDescription,
  };
}

export default async function LocalizedHome({ params }: LocalizedPageProps) {
  const { locale: requestedLocale } = await params;
  if (!isLocale(requestedLocale)) notFound();

  const copy = messages[requestedLocale];
  const isArabic = requestedLocale === "ar";

  return (
    <main lang={requestedLocale} dir={isArabic ? "rtl" : "ltr"}>
      <header className="site-header">
        <div className="header-inner">
          <Link className="wordmark" href={`/${requestedLocale}`} aria-label="TAKWEEN home">
            <span className="wordmark-symbol" aria-hidden="true">
              T
            </span>
            <span>TAKWEEN</span>
          </Link>
          <nav className="main-nav" aria-label={copy.navigationLabel}>
            <a href="#services">{copy.navServices}</a>
            <a href="#approach">{copy.navApproach}</a>
            <a href="#contact">{copy.navContact}</a>
          </nav>
          <details className="mobile-menu">
            <summary aria-label={copy.menuLabel}>
              <span>{copy.menuLabel}</span>
              <span className="mobile-menu-icon" aria-hidden="true">
                ☰
              </span>
            </summary>
            <nav className="mobile-menu-links" aria-label={copy.navigationLabel}>
              <a href="#services">{copy.navServices}</a>
              <a href="#approach">{copy.navApproach}</a>
              <a href="#contact">{copy.navContact}</a>
              <Link href={`/${requestedLocale}/login`}>{copy.employeeLogin}</Link>
            </nav>
          </details>
          <div className="header-actions">
            <Link className="employee-login-link" href={`/${requestedLocale}/login`}>
              {copy.employeeLogin}
            </Link>
            <Link
              className="language-switch"
              href={isArabic ? "/en" : "/ar"}
              lang={isArabic ? "en" : "ar"}
              dir={isArabic ? "ltr" : "rtl"}
              aria-label={isArabic ? "Switch to English" : "التبديل إلى العربية"}
            >
              {copy.switchLanguage}
            </Link>
            <a className="button button-small button-dark header-cta" href="#contact">
              {copy.headerCta}
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </header>

      <section className="hero">
        <div className="hero-orbit hero-orbit-one" aria-hidden="true" />
        <div className="hero-orbit hero-orbit-two" aria-hidden="true" />
        <div className="hero-content">
          <p className="eyebrow">
            <span className="eyebrow-dot" />
            {copy.eyebrow}
          </p>
          <h1>{copy.heroTitle}</h1>
          <p className="hero-description">{copy.heroDescription}</p>
          <div className="hero-actions">
            <a className="button button-light" href="#contact">
              {copy.primaryCta}
              <span aria-hidden="true">{isArabic ? "←" : "→"}</span>
            </a>
            <a className="text-link hero-secondary" href="#services">
              {copy.secondaryCta}
              <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>
        <div className="hero-note">
          <span className="hero-note-mark" aria-hidden="true">
            ✳
          </span>
          <p>{copy.heroNote}</p>
        </div>
        <div className="hero-index" aria-hidden="true">
          01 <span /> 03
        </div>
      </section>

      <section className="intro-section section-wrap" id="approach">
        <p className="eyebrow eyebrow-muted">{copy.introEyebrow}</p>
        <div className="intro-grid">
          <h2>{copy.introTitle}</h2>
          <div className="intro-copy">
            <p>{copy.introDescription}</p>
            <a className="text-link" href="#contact">
              {copy.introLink}
              <span aria-hidden="true">{isArabic ? "←" : "→"}</span>
            </a>
          </div>
        </div>
      </section>

      <section className="services-section" id="services">
        <div className="section-wrap">
          <div className="section-heading">
            <div>
              <p className="eyebrow eyebrow-muted">{copy.servicesEyebrow}</p>
              <h2>{copy.servicesTitle}</h2>
            </div>
            <p className="section-aside">{copy.servicesDescription}</p>
          </div>
          <div className="service-grid">
            {copy.services.map((service, index) => (
              <article className="service-card" key={service.title}>
                <span className="service-number">0{index + 1}</span>
                <div className="service-icon" aria-hidden="true">
                  {["◌", "⌘", "↗"][index]}
                </div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <a className="card-link" href="#contact" aria-label={`${service.title} — ${copy.getInTouch}`}>
                  <span>{copy.learnMore}</span>
                  <span aria-hidden="true">{isArabic ? "←" : "→"}</span>
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="closing-section section-wrap" id="contact">
        <div className="closing-card">
          <p className="eyebrow">{copy.closingEyebrow}</p>
          <h2>{copy.closingTitle}</h2>
          <p className="closing-description">{copy.closingDescription}</p>
          <a className="button button-light" href="mailto:hello@takween.co">
            {copy.getInTouch}
            <span aria-hidden="true">{isArabic ? "←" : "→"}</span>
          </a>
          <span className="closing-spark" aria-hidden="true">
            ✳
          </span>
        </div>
      </section>

      <footer className="site-footer">
        <div className="footer-inner">
          <Link className="wordmark footer-wordmark" href={`/${requestedLocale}`}>
            <span className="wordmark-symbol" aria-hidden="true">
              T
            </span>
            <span>TAKWEEN</span>
          </Link>
          <p>{copy.footerNote}</p>
          <span>© TAKWEEN</span>
        </div>
      </footer>
    </main>
  );
}
