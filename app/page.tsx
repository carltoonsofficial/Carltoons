export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      {/* Navigation */}
      <header className="border-b border-white/10 bg-neutral-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-2xl font-black tracking-tight">
              CARL<span className="text-orange-500">TOONS</span>
            </h1>
            <p className="text-xs text-neutral-500">
              Official Creator Website
            </p>
          </div>

          <nav className="hidden gap-8 text-sm font-medium md:flex">
            <a href="#" className="transition hover:text-orange-400">
              Home
            </a>
            <a href="#videos" className="transition hover:text-orange-400">
              Videos
            </a>
            <a href="#art" className="transition hover:text-orange-400">
              Art
            </a>
            <a href="#social" className="transition hover:text-orange-400">
              Social Media
            </a>
            <a href="#about" className="transition hover:text-orange-400">
              About
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.20),transparent_40%)]" />

        <div className="relative mx-auto max-w-7xl px-6 py-28 md:py-40">
          <div className="max-w-4xl">
            <p className="mb-5 text-sm font-bold uppercase tracking-[0.3em] text-orange-400">
              Welcome to Carltoons
            </p>

            <h2 className="text-5xl font-black leading-tight tracking-tight md:text-7xl">
              Creativity,
              <br />
              <span className="text-orange-500">comedy & imagination.</span>
            </h2>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-neutral-400">
              The official home of Carltoons — bringing together original
              artwork, videos, stories, characters, and all of my social
              media in one place.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="#videos"
                className="rounded-full bg-orange-500 px-7 py-3 font-bold text-black transition hover:bg-orange-400"
              >
                Watch Videos
              </a>

              <a
                href="#social"
                className="rounded-full border border-white/20 px-7 py-3 font-bold transition hover:bg-white/10"
              >
                Find Me Online
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Content */}
      <section id="videos" className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-10">
          <p className="text-sm font-bold uppercase tracking-widest text-orange-400">
            Featured
          </p>
          <h3 className="mt-2 text-3xl font-black md:text-4xl">
            Latest Content
          </h3>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="group rounded-3xl border border-white/10 bg-white/[0.04] p-8 transition hover:-translate-y-1 hover:border-orange-500/40">
            <div className="mb-6 flex h-40 items-center justify-center rounded-2xl bg-neutral-900 text-5xl">
              🎬
            </div>
            <h4 className="text-xl font-bold">Videos</h4>
            <p className="mt-2 text-neutral-500">
              Watch the latest Carltoons videos and productions.
            </p>
          </div>

          <div
            id="art"
            className="group rounded-3xl border border-white/10 bg-white/[0.04] p-8 transition hover:-translate-y-1 hover:border-orange-500/40"
          >
            <div className="mb-6 flex h-40 items-center justify-center rounded-2xl bg-neutral-900 text-5xl">
              🎨
            </div>
            <h4 className="text-xl font-bold">Artwork</h4>
            <p className="mt-2 text-neutral-500">
              Explore original drawings, illustrations, and creative projects.
            </p>
          </div>

          <div className="group rounded-3xl border border-white/10 bg-white/[0.04] p-8 transition hover:-translate-y-1 hover:border-orange-500/40">
            <div className="mb-6 flex h-40 items-center justify-center rounded-2xl bg-neutral-900 text-5xl">
              ⭐
            </div>
            <h4 className="text-xl font-bold">Featured Projects</h4>
            <p className="mt-2 text-neutral-500">
              Discover stories, characters, experiments, and productions.
            </p>
          </div>
        </div>
      </section>

      {/* Social Media */}
      <section id="social" className="border-y border-white/10 bg-white/[0.02]">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <p className="text-sm font-bold uppercase tracking-widest text-orange-400">
            Connect
          </p>

          <h3 className="mt-2 text-3xl font-black md:text-4xl">
            Carltoons Everywhere
          </h3>

          <p className="mt-4 max-w-2xl text-neutral-400">
            Follow Carltoons across social platforms and keep up with new
            content.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {["Facebook", "YouTube", "Instagram", "TikTok"].map(
              (platform) => (
                <a
                  key={platform}
                  href="#"
                  className="rounded-2xl border border-white/10 bg-neutral-950 p-6 font-bold transition hover:border-orange-500/50 hover:bg-orange-500/10"
                >
                  {platform}
                  <span className="ml-2 text-orange-500">↗</span>
                </a>
              )
            )}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="mx-auto max-w-7xl px-6 py-24">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-widest text-orange-400">
            About
          </p>

          <h3 className="mt-2 text-3xl font-black md:text-4xl">
            One home for everything Carltoons.
          </h3>

          <p className="mt-6 text-lg leading-8 text-neutral-400">
            Carltoons.com is being built as the central home for my creative
            work, social media, videos, artwork, stories, and future projects.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 text-sm text-neutral-500 md:flex-row md:items-center md:justify-between">
          <p>© 2026 Carltoons. All rights reserved.</p>
          <p>Official Carltoons Website</p>
        </div>
      </footer>
    </main>
  );
}