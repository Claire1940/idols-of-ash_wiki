'use client'

import { useEffect, useState, Suspense, lazy } from 'react'
import {
  Activity,
  AlertTriangle,
  Anchor,
  ArrowRight,
  BookMarked,
  BookOpen,
  Bug,
  Check,
  ChevronDown,
  Download,
  ExternalLink,
  EyeOff,
  FileText,
  Flame,
  Gamepad2,
  GitBranch,
  Globe,
  Layers,
  Library,
  Lightbulb,
  Lock,
  Map,
  MessageCircle,
  Monitor,
  Moon,
  ScrollText,
  ShoppingBag,
  Skull,
  Sparkles,
  Timer,
  Trophy,
  Volume2,
  Wind,
  Zap,
} from 'lucide-react'
import Link from 'next/link'
import { useMessages } from 'next-intl'
import { VideoFeature } from '@/components/home/VideoFeature'
import { LatestGuidesAccordion } from '@/components/home/LatestGuidesAccordion'
import { NativeBannerAd, AdBanner } from '@/components/ads'
import { SidebarAd } from '@/components/ads/SidebarAd'
import { scrollToSection } from '@/lib/scrollToSection'
import { DynamicIcon } from '@/components/ui/DynamicIcon'
import type { ContentItemWithType } from '@/lib/getLatestArticles'
import type { ModuleLinkMap } from '@/lib/buildModuleLinkMap'

// Lazy load heavy components
const HeroStats = lazy(() => import('@/components/home/HeroStats'))
const FAQSection = lazy(() => import('@/components/home/FAQSection'))
const CTASection = lazy(() => import('@/components/home/CTASection'))

// Loading placeholder
const LoadingPlaceholder = ({ height = 'h-64' }: { height?: string }) => (
  <div className={`${height} bg-white/5 border border-border rounded-xl animate-pulse`} />
)

// Conditionally render text as a link or plain span
function LinkedTitle({
  linkData,
  children,
  className,
  locale,
}: {
  linkData: { url: string; title: string } | null | undefined
  children: React.ReactNode
  className?: string
  locale: string
}) {
  if (linkData) {
    const href = locale === 'en' ? linkData.url : `/${locale}${linkData.url}`
    return (
      <Link
        href={href}
        className={`${className || ''} hover:text-[hsl(var(--nav-theme-light))] hover:underline decoration-[hsl(var(--nav-theme-light))/0.4] underline-offset-4 transition-colors`}
        title={linkData.title}
      >
        {children}
      </Link>
    )
  }
  return <>{children}</>
}

interface HomePageClientProps {
  latestArticles: ContentItemWithType[]
  moduleLinkMap: ModuleLinkMap
  locale: string
}

export default function HomePageClient({ latestArticles, moduleLinkMap, locale }: HomePageClientProps) {
  const t = useMessages() as any
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.idols-of-ash.wiki'

  // Structured data
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: siteUrl,
        name: "Idols of Ash Wiki",
        description: "Idols of Ash hub covering download info, controls, endings, Nightmare and First Kiln guides, speedrun routes, and technical fixes.",
        image: {
          '@type': 'ImageObject',
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "Idols of Ash - Free Indie Horror Climbing Game",
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: `${siteUrl}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        name: "Idols of Ash Wiki",
        alternateName: "Idols of Ash",
        url: siteUrl,
        description: "Idols of Ash Wiki resource hub for download, controls, endings, Nightmare, First Kiln, speedruns, and technical fixes",
        logo: {
          '@type': 'ImageObject',
          url: `${siteUrl}/android-chrome-512x512.png`,
          width: 512,
          height: 512,
        },
        image: {
          '@type': 'ImageObject',
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "Idols of Ash Wiki - Free Indie Horror Climbing Game",
        },
        sameAs: [
          'https://leafygames.itch.io/idols-of-ash',
          'https://idolsofash.io/',
          'https://x.com/leafygames',
          'https://www.youtube.com/@leafygames',
        ],
      },
      {
        '@type': 'VideoGame',
        name: "Idols of Ash",
        gamePlatform: ['PC', 'itch.io'],
        applicationCategory: 'Game',
        genre: ['Horror', 'Indie', 'Climbing', 'Action'],
        numberOfPlayers: {
          minValue: 1,
          maxValue: 1,
        },
        offers: {
          '@type': 'Offer',
          priceCurrency: 'USD',
          price: '0',
          availability: 'https://schema.org/InStock',
          url: 'https://leafygames.itch.io/idols-of-ash',
        },
      },
    ],
  }

  // FAQ accordion state
  const [faqExpanded, setFaqExpanded] = useState<number | null>(null)

  // Scroll reveal animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('scroll-reveal-visible')
          }
        })
      },
      { threshold: 0.1 }
    )

    document.querySelectorAll('.scroll-reveal').forEach((el) => {
      observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* 左侧广告容器 - Fixed 定位 */}
      <aside
        className="hidden xl:block fixed top-20 w-40 z-10"
        style={{ left: 'calc((100vw - 896px) / 2 - 180px)' }}
      >
        <SidebarAd type="sidebar-160x300" adKey={process.env.NEXT_PUBLIC_AD_SIDEBAR_160X300} />
      </aside>

      {/* 右侧广告容器 - Fixed 定位 */}
      <aside
        className="hidden xl:block fixed top-20 w-40 z-10"
        style={{ right: 'calc((100vw - 896px) / 2 - 180px)' }}
      >
        <SidebarAd type="sidebar-160x600" adKey={process.env.NEXT_PUBLIC_AD_SIDEBAR_160X600} />
      </aside>

      {/* 广告位 1: 移动端横幅 Sticky */}
      {/* <div className="sticky top-20 z-20 border-b border-border py-2">
        <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />
      </div> */}

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 scroll-reveal">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                            bg-[hsl(var(--nav-theme)/0.1)]
                            border border-[hsl(var(--nav-theme)/0.3)] mb-6">
              <Sparkles className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-sm font-medium">{t.hero.badge}</span>
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              {t.hero.title}
            </h1>

            {/* Description */}
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto">
              {t.hero.description}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <a
                href="https://leafygames.itch.io/idols-of-ash"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4
                           bg-[hsl(var(--nav-theme))] hover:bg-[hsl(var(--nav-theme)/0.9)]
                           text-white rounded-lg font-semibold text-lg transition-colors"
              >
                <BookOpen className="w-5 h-5" />
                {t.hero.getFreeCodesCTA}
              </a>
              <a
                href="https://idolsofash.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4
                           border border-border hover:bg-white/10 rounded-lg
                           font-semibold text-lg transition-colors"
              >
                {t.hero.playOnSteamCTA}
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Stats */}
          <Suspense fallback={<LoadingPlaceholder height="h-32" />}>
            <HeroStats stats={Object.values(t.hero.stats)} />
          </Suspense>
        </div>
      </section>

      {/* 广告位 2: 原生横幅 */}
      <NativeBannerAd adKey={process.env.NEXT_PUBLIC_AD_NATIVE_BANNER || ''} />

      {/* Video Section */}
      <section className="px-4 py-12">
        <div className="scroll-reveal container mx-auto max-w-4xl">
          <div className="relative rounded-2xl overflow-hidden">
            <VideoFeature
              videoId="hRJt3HAz1s0"
              title="IDOLS OF ASH | Official Trailer"
              posterImage="/images/hero.webp"
            />
          </div>
        </div>
      </section>

      {/* Latest Updates Section */}
      <LatestGuidesAccordion articles={latestArticles} locale={locale} max={30} />

      {/* 广告位 3: 标准横幅 728×90 */}
      <AdBanner type="banner-728x90" adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90} />

      {/* Tools Grid - 16 Navigation Cards */}
      <section className="px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t.tools.title}{' '}
              <span className="text-[hsl(var(--nav-theme-light))]">
                {t.tools.titleHighlight}
              </span>
            </h2>
            <p className="text-muted-foreground text-lg">
              {t.tools.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {t.tools.cards.map((card: any, index: number) => {
              // 映射卡片索引到 section ID
              const sectionIds = [
                'download', 'beginner-guide', 'controls', 'first-kiln',
                'nightmare-mode-guide', 'walkthrough', 'endings', 'grappling-hook-guide',
                'centipede-guide', 'black-screen-fix', 'steam-release', 'play-online',
                'game-modes', 'patch-notes', 'speedrun', 'story-explained'
              ]
              const sectionId = sectionIds[index]

              return (
                <button
                  key={index}
                  onClick={() => scrollToSection(sectionId)}
                  className="scroll-reveal group p-6 rounded-xl border border-border
                             bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                             transition-all duration-300 cursor-pointer text-left
                             hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="w-12 h-12 rounded-lg mb-4
                                  bg-[hsl(var(--nav-theme)/0.1)]
                                  flex items-center justify-center
                                  group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                                  transition-colors">
                    <DynamicIcon
                      name={card.icon}
                      className="w-6 h-6 text-[hsl(var(--nav-theme-light))]"
                    />
                  </div>
                  <h3 className="font-semibold mb-2">{card.title}</h3>
                  <p className="text-sm text-muted-foreground">{card.description}</p>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* 广告位 4: 方形广告 300×250 */}
      <AdBanner type="banner-300x250" adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250} />

      {/* Module 1: Download Guide */}
      <section id="download" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-4 text-sm font-medium text-[hsl(var(--nav-theme-light))]">
              Get the Game
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['download']} locale={locale}>
                {t.modules.download.title}
              </LinkedTitle>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.download.intro}</p>
          </div>

          {/* Steps */}
          <div className="scroll-reveal space-y-4 mb-10">
            {t.modules.download.steps.map((step: any, index: number) => (
              <div key={index} className="flex gap-4 p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[hsl(var(--nav-theme)/0.2)] border-2 border-[hsl(var(--nav-theme)/0.5)] flex items-center justify-center">
                  <span className="text-xl font-bold text-[hsl(var(--nav-theme-light))]">{index + 1}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Tips */}
          <div className="scroll-reveal p-6 bg-[hsl(var(--nav-theme)/0.05)] border border-[hsl(var(--nav-theme)/0.3)] rounded-xl">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
              <h3 className="font-bold text-lg">Quick Tips</h3>
            </div>
            <ul className="space-y-2">
              {t.modules.download.quickTips.map((tip: string, i: number) => (
                <li key={i} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground text-sm">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 广告位 5: 中型横幅 468×60 */}
      <AdBanner type="banner-468x60" adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60} />

      {/* Module 2: Beginner Guide */}
      <section id="beginner-guide" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-4 text-sm font-medium text-[hsl(var(--nav-theme-light))]">
              New Player Guide
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['beginnerGuide']} locale={locale}>
                {t.modules.beginnerGuide.title}
              </LinkedTitle>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.beginnerGuide.intro}</p>
          </div>

          {/* Steps */}
          <div className="scroll-reveal space-y-4 mb-10">
            {t.modules.beginnerGuide.steps.map((step: any, index: number) => (
              <div key={index} className="flex gap-4 p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[hsl(var(--nav-theme)/0.2)] border-2 border-[hsl(var(--nav-theme)/0.5)] flex items-center justify-center">
                  <span className="text-xl font-bold text-[hsl(var(--nav-theme-light))]">{index + 1}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Tips */}
          <div className="scroll-reveal p-6 bg-[hsl(var(--nav-theme)/0.05)] border border-[hsl(var(--nav-theme)/0.3)] rounded-xl">
            <div className="flex items-center gap-2 mb-4">
              <ArrowRight className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
              <h3 className="font-bold text-lg">Key Principles</h3>
            </div>
            <ul className="space-y-2">
              {t.modules.beginnerGuide.quickTips.map((tip: string, i: number) => (
                <li key={i} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground text-sm">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 广告位 6: 移动端横幅 320×50 */}
      <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />

      {/* Module 3: Controls */}
      <section id="controls" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-4 text-sm font-medium text-[hsl(var(--nav-theme-light))]">
              Input Reference
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['controls']} locale={locale}>
                {t.modules.controls.title}
              </LinkedTitle>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.controls.intro}</p>
          </div>

          {/* Controls Table */}
          <div className="scroll-reveal overflow-hidden rounded-xl border border-border">
            {/* Table Header */}
            <div className="hidden md:grid grid-cols-4 gap-0 bg-[hsl(var(--nav-theme)/0.1)] border-b border-border">
              <div className="px-5 py-3 text-sm font-semibold text-[hsl(var(--nav-theme-light))]">Action</div>
              <div className="px-5 py-3 text-sm font-semibold text-[hsl(var(--nav-theme-light))]">Input</div>
              <div className="px-5 py-3 text-sm font-semibold text-[hsl(var(--nav-theme-light))]">Platform</div>
              <div className="px-5 py-3 text-sm font-semibold text-[hsl(var(--nav-theme-light))]">Notes</div>
            </div>
            {/* Table Rows */}
            {t.modules.controls.rows.map((row: any, index: number) => (
              <div
                key={index}
                className={`grid grid-cols-1 md:grid-cols-4 gap-0 border-b border-border last:border-0 hover:bg-white/5 transition-colors ${index % 2 === 0 ? 'bg-white/[0.02]' : ''}`}
              >
                <div className="px-5 py-4">
                  <span className="md:hidden text-xs text-muted-foreground block mb-1">Action</span>
                  <span className="font-semibold text-sm">{row.action}</span>
                </div>
                <div className="px-5 py-4">
                  <span className="md:hidden text-xs text-muted-foreground block mb-1">Input</span>
                  <code className="text-sm bg-[hsl(var(--nav-theme)/0.1)] px-2 py-0.5 rounded text-[hsl(var(--nav-theme-light))] font-mono">{row.input}</code>
                </div>
                <div className="px-5 py-4">
                  <span className="md:hidden text-xs text-muted-foreground block mb-1">Platform</span>
                  <span className="text-sm text-muted-foreground">{row.platform}</span>
                </div>
                <div className="px-5 py-4">
                  <span className="md:hidden text-xs text-muted-foreground block mb-1">Notes</span>
                  <span className="text-sm text-muted-foreground">{row.notes}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Version note */}
          <div className="scroll-reveal mt-6 flex items-start gap-3 p-4 bg-[hsl(var(--nav-theme)/0.05)] border border-[hsl(var(--nav-theme)/0.3)] rounded-xl">
            <Gamepad2 className="w-5 h-5 text-[hsl(var(--nav-theme-light))] flex-shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">Gamepad support is confirmed. Sensitivity and Invert Y options were added in Version 1.12 and apply to both mouse and gamepad independently.</p>
          </div>
        </div>
      </section>

      {/* Module 4: First Kiln Guide */}
      <section id="first-kiln" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-4 text-sm font-medium text-[hsl(var(--nav-theme-light))]">
              Ultimate Challenge
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['firstKiln']} locale={locale}>
                {t.modules.firstKiln.title}
              </LinkedTitle>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.firstKiln.intro}</p>
          </div>

          {/* Accordion using details/summary */}
          <div className="scroll-reveal space-y-3 mb-10">
            {t.modules.firstKiln.items.map((item: any, index: number) => (
              <details
                key={index}
                className="group border border-border rounded-xl overflow-hidden hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <summary className="flex items-center justify-between p-5 cursor-pointer hover:bg-white/5 transition-colors list-none">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[hsl(var(--nav-theme)/0.15)] flex items-center justify-center flex-shrink-0">
                      <Flame className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
                    </div>
                    <span className="font-semibold">{item.title}</span>
                  </div>
                  <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform group-open:rotate-180" />
                </summary>
                <div className="px-5 pb-5 text-muted-foreground text-sm leading-relaxed border-t border-border pt-4">
                  {item.content}
                </div>
              </details>
            ))}
          </div>

          {/* Warning callout */}
          <div className="scroll-reveal p-6 bg-[hsl(var(--nav-theme)/0.08)] border border-[hsl(var(--nav-theme)/0.3)] rounded-xl">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-[hsl(var(--nav-theme-light))] flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold mb-2">Get the latest build before attempting First Kiln</h3>
                <p className="text-sm text-muted-foreground mb-3">Version 1.1 adjusted rope behavior at depth specifically to improve First Kiln runs. Older builds may feel inconsistent in the deeper sections.</p>
                <a
                  href="https://leafygames.itch.io/idols-of-ash"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-sm hover:bg-[hsl(var(--nav-theme)/0.2)] transition-colors"
                >
                  <MessageCircle className="w-4 h-4" /> Official itch.io Page <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Module 5: Nightmare Mode Guide */}
      <section id="nightmare-mode-guide" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-4 text-sm font-medium text-[hsl(var(--nav-theme-light))]">
              {t.modules.nightmareModeGuide.eyebrow}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['nightmareModeGuide']} locale={locale}>
                {t.modules.nightmareModeGuide.title}
              </LinkedTitle>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.nightmareModeGuide.intro}</p>
          </div>

          {/* Cards Grid */}
          {(() => {
            const cardIcons = [Lock, Zap, EyeOff, Activity, AlertTriangle, Trophy]
            return (
              <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {t.modules.nightmareModeGuide.items.map((item: any, index: number) => {
                  const Icon = cardIcons[index % cardIcons.length]
                  return (
                    <div
                      key={index}
                      className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.08)] transition-all duration-300"
                    >
                      <div className="w-10 h-10 rounded-lg bg-[hsl(var(--nav-theme)/0.12)] flex items-center justify-center mb-4">
                        <Icon className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                      </div>
                      <h3 className="font-bold text-base mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
                    </div>
                  )
                })}
              </div>
            )
          })()}
        </div>
      </section>

      {/* 广告位: 标准横幅 728×90 */}
      <AdBanner type="banner-728x90" adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90} />

      {/* Module 6: Walkthrough */}
      <section id="walkthrough" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-4 text-sm font-medium text-[hsl(var(--nav-theme-light))]">
              {t.modules.walkthrough.eyebrow}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['walkthrough']} locale={locale}>
                {t.modules.walkthrough.title}
              </LinkedTitle>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.walkthrough.intro}</p>
          </div>

          {/* Steps */}
          <div className="scroll-reveal relative">
            {/* Vertical connector line */}
            <div className="hidden md:block absolute left-6 top-6 bottom-6 w-0.5 bg-[hsl(var(--nav-theme)/0.2)]" />
            <div className="space-y-4">
              {t.modules.walkthrough.steps.map((step: any, index: number) => (
                <div key={index} className="flex gap-5 p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[hsl(var(--nav-theme)/0.2)] border-2 border-[hsl(var(--nav-theme)/0.5)] flex items-center justify-center z-10">
                    <span className="text-xl font-bold text-[hsl(var(--nav-theme-light))]">{index + 1}</span>
                  </div>
                  <div className="pt-1">
                    <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation tip */}
          <div className="scroll-reveal mt-8 flex items-start gap-3 p-4 bg-[hsl(var(--nav-theme)/0.05)] border border-[hsl(var(--nav-theme)/0.3)] rounded-xl">
            <Map className="w-5 h-5 text-[hsl(var(--nav-theme-light))] flex-shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">Follow each step in sequence for the cleanest first-clear route. Nightmare-ready players should focus on steps 2 and 6 — momentum is the most transferable skill.</p>
          </div>
        </div>
      </section>

      {/* Module 7: Endings */}
      <section id="endings" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-4 text-sm font-medium text-[hsl(var(--nav-theme-light))]">
              {t.modules.endings.eyebrow}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['endings']} locale={locale}>
                {t.modules.endings.title}
              </LinkedTitle>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.endings.intro}</p>
          </div>

          {/* Accordion using details/summary */}
          <div className="scroll-reveal space-y-3 mb-10">
            {t.modules.endings.items.map((item: any, index: number) => (
              <details
                key={index}
                className="group border border-border rounded-xl overflow-hidden hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <summary className="flex items-center justify-between p-5 cursor-pointer hover:bg-white/5 transition-colors list-none">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[hsl(var(--nav-theme)/0.15)] flex items-center justify-center flex-shrink-0">
                      <GitBranch className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
                    </div>
                    <span className="font-semibold text-sm md:text-base">{item.question}</span>
                  </div>
                  <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0 ml-3 transition-transform group-open:rotate-180" />
                </summary>
                <div className="px-5 pb-5 text-muted-foreground text-sm leading-relaxed border-t border-border pt-4">
                  {item.answer}
                </div>
              </details>
            ))}
          </div>

          {/* Endings progression note */}
          <div className="scroll-reveal p-5 bg-[hsl(var(--nav-theme)/0.05)] border border-[hsl(var(--nav-theme)/0.3)] rounded-xl flex items-start gap-3">
            <BookMarked className="w-5 h-5 text-[hsl(var(--nav-theme-light))] flex-shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">All three endings share the descent-to-bottom objective. The difference is execution difficulty and level structure — not alternative narrative paths.</p>
          </div>
        </div>
      </section>

      {/* 广告位: 方形广告 300×250 */}
      <AdBanner type="banner-300x250" adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250} />

      {/* Module 8: Grappling Hook Guide */}
      <section id="grappling-hook-guide" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-4 text-sm font-medium text-[hsl(var(--nav-theme-light))]">
              {t.modules.grapplingHookGuide.eyebrow}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['grapplingHookGuide']} locale={locale}>
                {t.modules.grapplingHookGuide.title}
              </LinkedTitle>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.grapplingHookGuide.intro}</p>
          </div>

          {/* Steps */}
          <div className="scroll-reveal space-y-4 mb-10">
            {t.modules.grapplingHookGuide.steps.map((step: any, index: number) => (
              <div key={index} className="flex gap-4 p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[hsl(var(--nav-theme)/0.2)] border-2 border-[hsl(var(--nav-theme)/0.5)] flex items-center justify-center">
                  <span className="text-xl font-bold text-[hsl(var(--nav-theme-light))]">{index + 1}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Hook tip callout */}
          <div className="scroll-reveal p-6 bg-[hsl(var(--nav-theme)/0.08)] border border-[hsl(var(--nav-theme)/0.3)] rounded-xl">
            <div className="flex items-start gap-3">
              <Anchor className="w-5 h-5 text-[hsl(var(--nav-theme-light))] flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold mb-2">Practice the 45-degree release on Normal first</h3>
                <p className="text-sm text-muted-foreground mb-3">The hook timing is identical across all modes. Locking in the release angle on Normal builds the muscle memory you need before Nightmare and First Kiln raise the pressure.</p>
                <a
                  href="https://leafygames.itch.io/idols-of-ash"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-sm hover:bg-[hsl(var(--nav-theme)/0.2)] transition-colors"
                >
                  <ExternalLink className="w-4 h-4" /> Download on itch.io
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Module 9: Centipede Guide */}
      <section id="centipede-guide" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-4 text-sm font-medium text-[hsl(var(--nav-theme-light))]">
              {t.modules.centipede.eyebrow}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['centipede']} locale={locale}>
                {t.modules.centipede.title}
              </LinkedTitle>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.centipede.subtitle}</p>
          </div>

          <p className="text-muted-foreground text-base max-w-3xl mx-auto text-center mb-10 scroll-reveal">
            {t.modules.centipede.intro}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 scroll-reveal">
            {t.modules.centipede.cards.map((card: any, i: number) => {
              const icons = [Skull, Volume2, Zap, Wind, FileText]
              const IconComp = icons[i] || Skull
              return (
                <div key={i} className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-[hsl(var(--nav-theme)/0.1)] flex items-center justify-center flex-shrink-0">
                      <IconComp className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                    </div>
                    <h3 className="text-lg font-bold">{card.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{card.body}</p>
                  <ul className="space-y-1">
                    {card.bullets.map((bullet: string, j: number) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[hsl(var(--nav-theme-light))] flex-shrink-0" />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Module 10: Black Screen Fix */}
      <section id="black-screen-fix" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-4 text-sm font-medium text-[hsl(var(--nav-theme-light))]">
              {t.modules.blackScreenFix.eyebrow}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['blackScreenFix']} locale={locale}>
                {t.modules.blackScreenFix.title}
              </LinkedTitle>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.blackScreenFix.subtitle}</p>
          </div>

          <p className="text-muted-foreground text-base max-w-3xl mx-auto text-center mb-10 scroll-reveal">
            {t.modules.blackScreenFix.intro}
          </p>

          <div className="scroll-reveal space-y-3">
            {t.modules.blackScreenFix.items.map((item: any, i: number) => (
              <details
                key={i}
                className="group border border-border rounded-xl overflow-hidden hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <summary className="flex items-center justify-between p-5 cursor-pointer hover:bg-white/5 transition-colors list-none">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[hsl(var(--nav-theme)/0.15)] flex items-center justify-center flex-shrink-0">
                      <Monitor className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
                    </div>
                    <span className="font-semibold text-sm md:text-base">{item.question}</span>
                  </div>
                  <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0 ml-3 transition-transform group-open:rotate-180" />
                </summary>
                <div className="px-5 pb-5 text-muted-foreground text-sm leading-relaxed border-t border-border pt-4">
                  {item.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Module 11: Steam Release */}
      <section id="steam-release" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-4 text-sm font-medium text-[hsl(var(--nav-theme-light))]">
              {t.modules.steamRelease.eyebrow}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['steamRelease']} locale={locale}>
                {t.modules.steamRelease.title}
              </LinkedTitle>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.steamRelease.subtitle}</p>
          </div>

          <p className="text-muted-foreground text-base max-w-3xl mx-auto text-center mb-10 scroll-reveal">
            {t.modules.steamRelease.intro}
          </p>

          {/* Desktop table */}
          <div className="scroll-reveal hidden md:block rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[hsl(var(--nav-theme)/0.1)] border-b border-border">
                  <th className="text-left px-6 py-4 font-semibold text-[hsl(var(--nav-theme-light))]">Topic</th>
                  <th className="text-left px-6 py-4 font-semibold text-[hsl(var(--nav-theme-light))]">Status</th>
                </tr>
              </thead>
              <tbody>
                {t.modules.steamRelease.items.map((row: any, i: number) => (
                  <tr key={i} className={`border-b border-border last:border-0 ${i % 2 === 0 ? '' : 'bg-white/[0.02]'}`}>
                    <td className="px-6 py-4 font-medium">{row.topic}</td>
                    <td className="px-6 py-4 text-muted-foreground">{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile stacked cards */}
          <div className="md:hidden space-y-3 scroll-reveal">
            {t.modules.steamRelease.items.map((row: any, i: number) => (
              <div key={i} className="p-4 bg-white/5 border border-border rounded-xl">
                <p className="text-xs font-semibold text-[hsl(var(--nav-theme-light))] uppercase tracking-wide mb-1">{row.topic}</p>
                <p className="text-sm text-muted-foreground">{row.value}</p>
              </div>
            ))}
          </div>

          <div className="scroll-reveal mt-8 flex justify-center">
            <a
              href="https://idolsofash.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-sm font-medium hover:bg-[hsl(var(--nav-theme)/0.2)] transition-colors"
            >
              <ShoppingBag className="w-4 h-4" /> Visit Official Site
            </a>
          </div>
        </div>
      </section>

      {/* Module 12: Play Online */}
      <section id="play-online" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-4 text-sm font-medium text-[hsl(var(--nav-theme-light))]">
              {t.modules.playOnline.eyebrow}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['playOnline']} locale={locale}>
                {t.modules.playOnline.title}
              </LinkedTitle>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.playOnline.subtitle}</p>
          </div>

          <p className="text-muted-foreground text-base max-w-3xl mx-auto text-center mb-10 scroll-reveal">
            {t.modules.playOnline.intro}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 scroll-reveal">
            {t.modules.playOnline.cards.map((card: any, i: number) => {
              const icons = [Globe, BookOpen, Download, AlertTriangle, Lightbulb]
              const IconComp = icons[i] || Globe
              return (
                <div key={i} className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-[hsl(var(--nav-theme)/0.1)] flex items-center justify-center mb-4">
                    <IconComp className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                  </div>
                  <h3 className="text-base font-bold mb-2">{card.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{card.body}</p>
                  <ul className="space-y-1">
                    {card.bullets.map((bullet: string, j: number) => (
                      <li key={j} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[hsl(var(--nav-theme-light))] flex-shrink-0" />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Module 13: Game Modes */}
      <section id="game-modes" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-4 text-sm font-medium text-[hsl(var(--nav-theme-light))]">
              {t.modules.gameModes.eyebrow}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['gameModes']} locale={locale}>
                {t.modules.gameModes.title}
              </LinkedTitle>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.gameModes.subtitle}</p>
          </div>

          <p className="text-muted-foreground text-base max-w-3xl mx-auto text-center mb-10 scroll-reveal">
            {t.modules.gameModes.intro}
          </p>

          {/* Mode Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 scroll-reveal">
            {t.modules.gameModes.modeCards.map((card: any, i: number) => {
              const icons = [BookOpen, Moon, Flame]
              const IconComp = icons[i] || Layers
              return (
                <div key={i} className={`p-6 rounded-xl border ${i === 0 ? 'border-[hsl(var(--nav-theme)/0.3)] bg-[hsl(var(--nav-theme)/0.05)]' : i === 1 ? 'border-border bg-white/[0.03]' : 'border-[hsl(var(--nav-theme)/0.5)] bg-[hsl(var(--nav-theme)/0.08)]'}`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-[hsl(var(--nav-theme)/0.15)] flex items-center justify-center flex-shrink-0">
                      <IconComp className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base">{card.mode}</h3>
                      <span className="text-xs text-[hsl(var(--nav-theme-light))] font-medium">{card.badge}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{card.summary}</p>
                </div>
              )
            })}
          </div>

          {/* Comparison Table - Desktop */}
          <div className="scroll-reveal hidden md:block rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[hsl(var(--nav-theme)/0.1)] border-b border-border">
                  {t.modules.gameModes.tableHeaders.map((header: string, i: number) => (
                    <th key={i} className={`text-left px-5 py-4 font-semibold ${i === 0 ? 'text-muted-foreground w-32' : 'text-[hsl(var(--nav-theme-light))]'}`}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {t.modules.gameModes.tableRows.map((row: string[], i: number) => (
                  <tr key={i} className={`border-b border-border last:border-0 ${i % 2 === 0 ? '' : 'bg-white/[0.02]'}`}>
                    {row.map((cell: string, j: number) => (
                      <td key={j} className={`px-5 py-4 ${j === 0 ? 'font-semibold text-[hsl(var(--nav-theme-light))]' : 'text-muted-foreground'}`}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Comparison Table - Mobile stacked */}
          <div className="md:hidden space-y-4 scroll-reveal">
            {t.modules.gameModes.tableRows.map((row: string[], i: number) => (
              <div key={i} className="p-4 bg-white/5 border border-border rounded-xl">
                <p className="text-xs font-bold text-[hsl(var(--nav-theme-light))] uppercase tracking-wide mb-2">{row[0]}</p>
                <div className="space-y-1">
                  {t.modules.gameModes.tableHeaders.slice(1).map((header: string, j: number) => (
                    <p key={j} className="text-sm text-muted-foreground"><span className="font-medium text-foreground">{header}:</span> {row[j + 1]}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 14: Patch Notes */}
      <section id="patch-notes" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-4 text-sm font-medium text-[hsl(var(--nav-theme-light))]">
              {t.modules.patchNotes.eyebrow}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['patchNotes']} locale={locale}>
                {t.modules.patchNotes.title}
              </LinkedTitle>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.patchNotes.subtitle}</p>
          </div>

          <p className="text-muted-foreground text-base max-w-3xl mx-auto text-center mb-10 scroll-reveal">
            {t.modules.patchNotes.intro}
          </p>

          <div className="scroll-reveal space-y-4">
            {t.modules.patchNotes.items.map((item: any, i: number) => (
              <details
                key={i}
                className="group border border-border rounded-xl overflow-hidden hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                open={i === 0}
              >
                <summary className="flex items-center justify-between p-5 cursor-pointer hover:bg-white/5 transition-colors list-none">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-[hsl(var(--nav-theme)/0.15)] flex items-center justify-center flex-shrink-0">
                      <ScrollText className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-[hsl(var(--nav-theme-light))]">{item.version}</span>
                        <span className="text-xs text-muted-foreground">{item.date}</span>
                      </div>
                      <p className="font-semibold text-sm md:text-base truncate">{item.title}</p>
                    </div>
                  </div>
                  <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0 ml-3 transition-transform group-open:rotate-180" />
                </summary>
                <div className="px-5 pb-5 border-t border-border pt-4">
                  <p className="text-sm text-muted-foreground mb-3">{item.summary}</p>
                  <ul className="space-y-1.5">
                    {item.bullets.map((bullet: string, j: number) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              </details>
            ))}
          </div>

          <div className="mt-8 scroll-reveal flex justify-center">
            <a
              href="https://leafygames.itch.io/idols-of-ash/devlog"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-sm font-medium hover:bg-[hsl(var(--nav-theme)/0.2)] transition-colors"
            >
              <ExternalLink className="w-4 h-4" /> Read Full Devlog on itch.io
            </a>
          </div>
        </div>
      </section>

      {/* Module 15: Speedrun */}
      <section id="speedrun" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-4 text-sm font-medium text-[hsl(var(--nav-theme-light))]">
              {t.modules.speedrun.eyebrow}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['speedrun']} locale={locale}>
                {t.modules.speedrun.title}
              </LinkedTitle>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.speedrun.subtitle}</p>
          </div>

          <p className="text-muted-foreground text-base max-w-3xl mx-auto text-center mb-10 scroll-reveal">
            {t.modules.speedrun.intro}
          </p>

          {/* Speedrun Table - Desktop */}
          <div className="scroll-reveal hidden md:block rounded-xl border border-border overflow-hidden mb-8">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[hsl(var(--nav-theme)/0.1)] border-b border-border">
                  {t.modules.speedrun.tableHeaders.map((header: string, i: number) => (
                    <th key={i} className="text-left px-5 py-4 font-semibold text-[hsl(var(--nav-theme-light))]">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {t.modules.speedrun.tableRows.map((row: string[], i: number) => (
                  <tr key={i} className={`border-b border-border last:border-0 ${i % 2 === 0 ? '' : 'bg-white/[0.02]'}`}>
                    <td className="px-5 py-4 font-bold text-[hsl(var(--nav-theme-light))]">{row[0]}</td>
                    <td className="px-5 py-4 font-semibold">{row[1]}</td>
                    <td className="px-5 py-4 text-muted-foreground text-xs leading-relaxed">{row[2]}</td>
                    <td className="px-5 py-4 text-muted-foreground text-xs leading-relaxed">{row[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Speedrun Mobile stacked cards */}
          <div className="md:hidden space-y-4 scroll-reveal mb-8">
            {t.modules.speedrun.tableRows.map((row: string[], i: number) => (
              <div key={i} className="p-5 bg-white/5 border border-border rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-[hsl(var(--nav-theme)/0.15)] flex items-center justify-center flex-shrink-0">
                    <Timer className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
                  </div>
                  <div>
                    <p className="font-bold text-[hsl(var(--nav-theme-light))]">{row[0]}</p>
                    <p className="text-sm font-semibold">{row[1]}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mb-1"><span className="font-medium text-foreground">Route:</span> {row[2]}</p>
                <p className="text-xs text-muted-foreground"><span className="font-medium text-foreground">Why watch:</span> {row[3]}</p>
              </div>
            ))}
          </div>

          <div className="scroll-reveal flex justify-center">
            <a
              href="https://www.youtube.com/playlist?list=PLbxc3YvuPGhI5GX0-J81Me1SfRp3SIkiM"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-sm font-medium hover:bg-[hsl(var(--nav-theme)/0.2)] transition-colors"
            >
              <ExternalLink className="w-4 h-4" /> Watch Speedrun Playlist
            </a>
          </div>
        </div>
      </section>

      {/* Module 16: Story Explained */}
      <section id="story-explained" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-4 text-sm font-medium text-[hsl(var(--nav-theme-light))]">
              {t.modules.storyExplained.eyebrow}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['storyExplained']} locale={locale}>
                {t.modules.storyExplained.title}
              </LinkedTitle>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.storyExplained.subtitle}</p>
          </div>

          <p className="text-muted-foreground text-base max-w-3xl mx-auto text-center mb-10 scroll-reveal">
            {t.modules.storyExplained.intro}
          </p>

          <div className="scroll-reveal space-y-3">
            {t.modules.storyExplained.items.map((item: any, i: number) => {
              const icons = [Activity, Wind, Skull, Trophy]
              const IconComp = icons[i] || Library
              return (
                <details
                  key={i}
                  className="group border border-border rounded-xl overflow-hidden hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                  open={i === 0}
                >
                  <summary className="flex items-center justify-between p-5 cursor-pointer hover:bg-white/5 transition-colors list-none">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[hsl(var(--nav-theme)/0.15)] flex items-center justify-center flex-shrink-0">
                        <IconComp className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
                      </div>
                      <span className="font-semibold text-sm md:text-base">{item.section}</span>
                    </div>
                    <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0 ml-3 transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="px-5 pb-5 text-muted-foreground text-sm leading-relaxed border-t border-border pt-4">
                    {item.content}
                  </div>
                </details>
              )
            })}
          </div>

          <div className="mt-8 scroll-reveal p-5 bg-[hsl(var(--nav-theme)/0.05)] border border-[hsl(var(--nav-theme)/0.3)] rounded-xl">
            <div className="flex items-start gap-3">
              <Library className="w-5 h-5 text-[hsl(var(--nav-theme-light))] flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold mb-1">The story works because of what is not said</h3>
                <p className="text-sm text-muted-foreground">Idols of Ash does not over-explain its world. The descent, the ash, the centipede, and the endings build meaning through repetition and pressure rather than explicit lore text.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <FAQSection
          title={t.faq.title}
          titleHighlight={t.faq.titleHighlight}
          subtitle={t.faq.subtitle}
          questions={t.faq.questions}
        />
      </Suspense>

      {/* CTA Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <CTASection
          title={t.cta.title}
          description={t.cta.description}
          joinCommunity={t.cta.joinCommunity}
          joinGame={t.cta.joinGame}
        />
      </Suspense>

      {/* Ad Banner 3 */}
      <AdBanner type="banner-728x90" adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90} />

      {/* Footer */}
      <footer className="bg-white/[0.02] border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-[hsl(var(--nav-theme-light))]">
                {t.footer.title}
              </h3>
              <p className="text-sm text-muted-foreground">{t.footer.description}</p>
            </div>

            {/* Community - External Links Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.community}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://leafygames.itch.io/idols-of-ash"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.discord}
                  </a>
                </li>
                <li>
                  <a
                    href="https://x.com/leafygames"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.twitter}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.youtube.com/@leafygames"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.steamCommunity}
                  </a>
                </li>
                <li>
                  <a
                    href="https://idolsofash.io/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.steamStore}
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal - Internal Routes Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.legal}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.about}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.privacy}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-of-service"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.terms}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/copyright"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.copyrightNotice}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Copyright */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">{t.footer.copyright}</p>
              <p className="text-xs text-muted-foreground">{t.footer.disclaimer}</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
