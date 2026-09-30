const socialLinks = [
  {
    name: "Facebook",
    handle: "@carltoonsofficial",
    url: "https://www.facebook.com/carltoonsofficial",
  },
  {
    name: "Instagram",
    handle: "@carltoonsofficial",
    url: "https://www.instagram.com/carltoonsofficial",
  },
  {
    name: "YouTube",
    handle: "@carltoonsofficial",
    url: "https://www.youtube.com/@carltoonsofficial",
  },
  {
    name: "TikTok",
    handle: "@carltoonsofficial",
    url: "https://www.tiktok.com/@carltoonsofficial",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <a
            href="/"
            className="text-2xl font-black tracking-tight hover:text-orange-400"
          >
            CARLTOONS
          </a>

          <nav className="hidden gap-6 text-sm md:flex">
            <a href="#socials" className="hover:text-orange-400">
              Social Media
            </a>

            <a href="#about" className="hover:text-orange-400">
              About
            </a>

            <a href="#contact" className="hover:text-orange-400">
              Contact
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 py-24 text-center">
        <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-orange-400">
          Creator • Artist • Entertainment
        </p>

        <h1 className="text-5xl font-black tracking-tight md:text-7xl">
          Welcome to Carltoons
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/65">
          Official Carltoons website featuring original artwork, funny
          videos, stories, entertainment and social media.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <a
            href="#socials"
            className="rounded-full bg-orange-500 px-7 py-3 font-bold text-black transition hover:scale-105 hover:bg-orange-400"
          >
            Follow Carltoons
          </a>

          <a
            href="#about"
            className="rounded-full border border-white/20 px-7 py-3 font-bold transition hover:bg-white/10"
          >
            Explore
          </a>
        </div>
      </section>

      {/* SOCIAL MEDIA */}
      <section
        id="socials"
        className="mx-auto max-w-6xl scroll-mt-20 px-6 py-20"
      >
        <div className="mb-10 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-orange-400">
            Connect With Carltoons
          </p>

          <h2 className="mt-3 text-4xl font-black md:text-5xl">
            Official Social Media
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-white/60">
            Follow Carltoons across the official social-media platforms.
            Click any card to go directly to the account.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit Carltoons on ${social.name}`}
              className="group rounded-3xl border border-white/10 bg-white/[0.04] p-7 transition duration-300 hover:-translate-y-2 hover:border-orange-400/50 hover:bg-white/[0.08]"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-white/40">
                    Official
                  </p>

                  <h3 className="mt-2 text-2xl font-black">
                    {social.name}
                  </h3>
                </div>

                <span className="text-3xl transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </div>

              <p className="mt-5 text-sm text-white/50">
                {social.handle}
              </p>

              <div className="mt-7 inline-flex rounded-full border border-orange-400/30 px-4 py-2 text-sm font-bold text-orange-400 transition group-hover:bg-orange-500 group-hover:text-black">
                Visit {social.name} →
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* About */}
      <section
        id="about"
        className="mx-auto max-w-6xl scroll-mt-20 px-6 py-20"
      >
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 md:p-12">
          <p className="text-sm font-bold uppercase tracking-widest text-orange-400">
            About Carltoons
          </p>

          <h2 className="mt-3 text-4xl font-black">
            One home for Carltoons.
          </h2>

          <p className="mt-5 max-w-3xl leading-8 text-white/65">
            Carltoons is a creator and entertainment brand bringing together
            original artwork, funny content, videos, stories and social media
            in one place.
          </p>
        </div>
      </section>

      {/* Contact */}
      <section
        id="contact"
        className="mx-auto max-w-6xl scroll-mt-20 px-6 py-20"
      >
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 md:p-12">
          <p className="text-sm font-bold uppercase tracking-widest text-orange-400">
            Contact
          </p>

          <h2 className="mt-3 text-4xl font-black">
            Work with Carltoons
          </h2>

          <p className="mt-4 max-w-2xl leading-8 text-white/60">
            For business, collaboration and creative inquiries, connect with
            Carltoons through the official social-media accounts.
          </p>

          <a
            href="#socials"
            className="mt-7 inline-block rounded-full bg-orange-500 px-6 py-3 font-bold text-black transition hover:bg-orange-400"
          >
            View Official Accounts →
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-white/40">
        © {new Date().getFullYear()} Carltoons. All rights reserved.
      </footer>
    </main>
  );
}