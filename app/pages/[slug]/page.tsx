import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { readPages } from "@/lib/pages";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const page = (await readPages()).find(p => p.slug === slug && p.published);
  if (!page) return { title: "Page Not Found" };
  return { title: page.seoTitle || page.title, description: page.seoDescription || page.description, alternates: { canonical: `/pages/${page.slug}` } };
}

export default async function ManagedPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const page = (await readPages()).find(p => p.slug === slug && p.published); if (!page) notFound();
  return <main className="ct-page"><header className="ct-header"><div className="ct-container ct-header-inner"><a href="/" className="ct-brand"><span className="ct-brand-mark">C</span><span className="ct-brand-name">CARLTOONS</span></a><nav className="ct-nav"><a href="/">Home</a><a href="/videos">Videos</a><a href="/search">Search</a><a href="/pages/about">About</a><a href="/pages/contact">Contact</a></nav></div></header><section className="ct-section"><div className="ct-container"><div className="ct-eyebrow">Carltoons</div><h1>{page.title}</h1>{page.description && <p className="ct-lead">{page.description}</p>}<article className="ct-managed-page-content">{page.content.split(/\n\s*\n/).map((part,i) => <p key={i}>{part}</p>)}</article></div></section><footer className="ct-footer"><div className="ct-container"><a href="/">Carltoons</a><span> · </span><a href="/pages/privacy-policy">Privacy</a><span> · </span><a href="/pages/terms">Terms</a></div></footer></main>;
}
