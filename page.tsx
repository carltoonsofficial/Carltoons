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
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <a
            href="/"
            className="text-2xl font-black tracking-tight"
          >
            CARLTOONS
          </a>

          <nav className="hidden gap-6 text-sm md:flex">
            <a
              href="#socials"
              className="transition hover:text-orange-400"
            >
              Social Media
            </a>

            <a
              href="#about"
              className="transition hover:text-orange-400"
            >
              About
            </a>

            <a
              href="#contact"
              className="transition hover:text-orange-400"
            >
              Contact
            </a>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-24 text-center">
        <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-orange-400">
          Creator • Artist • Entertainment
        </p>

        <h1 className="text-5xl font-black tracking-tight md:text-7xl">
          Welcome to Carltoons
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/65">
          Official Carltoons website featuring original artwork,
          funny videos, stories, entertainment and official social
          media accounts.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <a
            href="#socials"
            className="rounded-full bg-orange-500 px-7 py-3 font-bold text-black transition hover:scale-105"
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

      <section
        id="socials"
        className="mx-auto max-w-6xl px-6 py-16"
      >
        <div className="mb-10">
          <p className="text-sm font-bold uppercase tracking-widest text-orange-400">
            Connect
          </p>

          <h2 className="mt-2 text-4xl font-black">
            Carltoons Social Media
          </h2>

          <p className="mt-3 text-white/60">
            Follow the official Carltoons accounts.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition hover:-translate-y-1 hover:border-orange-400/50 hover:bg-white/[0.08]"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">
                  {social.name}
                </h3>

                <span className="text-xl transition group-hover:translate-x-1">
                  →
                </span>
              </div>

              <p className="mt-3 text-sm text-white/50">
                {social.handle}
              </p>

              <p className="mt-6 text-sm font-semibold text-orange-400">
                Visit official account →
              </p>
            </a>
          ))}
        </div>
      </section>

      <section
        id="about"
        className="mx-auto max-w-6xl px-6 py-20"
      >
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 md:p-12">
          <p className="text-sm font-bold uppercase tracking-widest text-orange-400">
            About Carltoons
          </p>

          <h2 className="mt-3 text-4xl font-black">
            One home for Carltoons.
          </h2>

          <p className="mt-5 max-w-3xl leading-8 text-white/65">
            Carltoons is a creator and entertainment brand bringing
            together original artwork, funny content, videos, stories,
            and social media in one place.
          </p>
        </div>
      </section>

      <section
        id="contact"
        className="mx-auto max-w-6xl px-6 py-20"
      >
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 md:p-12">
          <p className="text-sm font-bold uppercase tracking-widest text-orange-400">
            Contact
          </p>

          <h2 className="mt-3 text-4xl font-black">
            Contact Carltoons
          </h2>

          <p className="mt-4 max-w-2xl leading-8 text-white/60">
            For business and collaboration inquiries, connect with
            Carltoons through the official social accounts.
          </p>

          <a
            href="https://www.facebook.com/carltoonsofficial"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-block rounded-full bg-orange-500 px-7 py-3 font-bold text-black transition hover:scale-105"
          >
            Contact Carltoons →
          </a>
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-white/40">
        © {new Date().getFullYear()} Carltoons. All rights reserved.
      </footer>
    </main>
  );
}