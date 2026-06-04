#!/usr/bin/env node
/**
 * Generates design/fatal-trainer.pen — flat UI, buttons-only backgrounds.
 * Run: node design/generate-pen.mjs
 */
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, 'fatal-trainer.pen');

const C = {
  primary: '#7C3AED',
  primarySubtle: '#EDE9FE',
  accent: '#EA580C',
  accentSubtle: '#FFEDD5',
  bubbleLavender: '#DDD6FE',
  bubbleSky: '#BAE6FD',
  bubblePink: '#FBCFE8',
  bubbleViolet: '#C4B5FD',
  glass: '#FFFFFFD9',
  neutral900: '#0F172A',
  neutral600: '#475569',
  neutral200: '#E2E8F0',
  surface: '#FFFFFF',
  surfaceMuted: '#FFFFFF',
  error: '#DC2626',
  rating: '#EAB308',
  skeleton: '#E2E8F0',
  skeletonMuted: '#E2E8F059',
  featuredGradientStart: '#A78BFA',
  featuredGradientEnd: '#38BDF8',
};

const FONT = 'Plus Jakarta Sans';
const R_CARD = 24;
const R_PILL = 24;
const R_BTN = 24;

let idCounter = 0;
const uid = (prefix) => `${prefix}${++idCounter}`;

function txt(content, opts = {}) {
  return {
    type: 'text',
    id: uid('t'),
    content,
    fontFamily: FONT,
    fontSize: opts.size ?? 14,
    fontWeight: opts.weight ?? 'normal',
    fill: opts.fill ?? C.neutral900,
    ...(opts.width ? { width: opts.width } : {}),
  };
}

function border(color = '#FFFFFF66') {
  return { align: 'inside', thickness: 1, fill: color };
}

function glassShadow() {
  return [{
    type: 'shadow',
    shadowType: 'outer',
    color: '#7C3AED14',
    offset: { x: 0, y: 8 },
    blur: 24,
  }];
}

function frame(name, w, h, opts = {}, children = []) {
  return {
    type: 'frame',
    id: uid('f'),
    name,
    clip: opts.clip ?? true,
    width: w,
    ...(h != null ? { height: h } : {}),
    fill: opts.fill ?? C.surface,
    layout: opts.layout ?? 'vertical',
    ...(opts.gap != null ? { gap: opts.gap } : {}),
    ...(opts.padding != null ? { padding: opts.padding } : {}),
    ...(opts.cornerRadius != null ? { cornerRadius: opts.cornerRadius } : {}),
    ...(opts.stroke ? { stroke: opts.stroke } : {}),
    ...(opts.effect ? { effect: opts.effect } : {}),
    ...(opts.alignItems ? { alignItems: opts.alignItems } : {}),
    ...(opts.justifyContent ? { justifyContent: opts.justifyContent } : {}),
    ...(opts.x != null ? { x: opts.x } : {}),
    ...(opts.y != null ? { y: opts.y } : {}),
    ...(opts.reusable ? { reusable: true } : {}),
    children,
  };
}

function radialFill(inner, outer) {
  return {
    type: 'gradient',
    gradientType: 'radial',
    enabled: true,
    opacity: 1,
    center: { x: 0.5, y: 0.5 },
    size: { width: 1, height: 1 },
    colors: [
      { color: inner, position: 0 },
      { color: outer, position: 1 },
    ],
  };
}

function gradientBubble(x, y, w, h, inner, outer, opacity = 0.65) {
  return {
    type: 'ellipse',
    id: uid('b'),
    x,
    y,
    width: w,
    height: h,
    opacity,
    fill: radialFill(inner, `${outer}00`),
    effect: [{ type: 'layer_blur', radius: 60 }],
  };
}

function screenBubbles(w, h) {
  return [
    gradientBubble(-40, -30, 180, 180, C.bubbleLavender, C.bubbleLavender),
    gradientBubble(w - 120, 40, 160, 160, C.bubbleSky, C.bubbleSky),
    gradientBubble(w / 2 - 80, h - 200, 200, 200, C.bubblePink, C.bubblePink),
    gradientBubble(w - 60, h / 2, 140, 140, C.bubbleViolet, C.bubbleViolet, 0.5),
  ];
}

function glassCard(name, w, h, children, extra = {}) {
  return frame(name, w, h, {
    fill: C.glass,
    stroke: border(),
    cornerRadius: R_CARD,
    effect: glassShadow(),
    padding: 16,
    gap: 12,
    ...extra,
  }, children);
}

function avatar(initials, color = C.primary, size = 72) {
  const r = 16;
  return frame('Avatar', size, size, {
    layout: 'none',
    fill: color,
    cornerRadius: r,
  }, [
    {
      type: 'text',
      id: uid('av'),
      content: initials,
      fontFamily: FONT,
      fontSize: 22,
      fontWeight: '600',
      fill: '#FFFFFF',
      x: size * 0.28,
      y: size * 0.3,
    },
  ]);
}

function badge(label, subtle = false) {
  return frame(`Badge ${label}`, null, 28, {
    layout: 'horizontal',
    fill: subtle ? C.accentSubtle : C.primarySubtle,
    cornerRadius: 14,
    padding: [6, 12],
    alignItems: 'center',
  }, [
    txt(label, { size: 12, fill: subtle ? C.accent : C.primary, weight: '500' }),
  ]);
}

function chip(label) {
  return frame(`Chip ${label}`, null, 32, {
    layout: 'horizontal',
    fill: C.primarySubtle,
    cornerRadius: 16,
    padding: [8, 12],
    gap: 6,
    alignItems: 'center',
  }, [
    txt(label, { size: 13, fill: C.primary, weight: '500' }),
    txt('×', { size: 14, fill: C.primary, weight: '600' }),
  ]);
}

function btn(label, variant = 'primary', w = null) {
  const isPrimary = variant === 'primary';
  const isGhost = variant === 'ghost';
  return frame(`Btn ${label}`, w, 52, {
    layout: 'horizontal',
    fill: isPrimary ? C.primary : isGhost ? 'transparent' : C.glass,
    stroke: isPrimary ? undefined : border(C.neutral200),
    cornerRadius: R_BTN,
    padding: [14, 20],
    alignItems: 'center',
    justifyContent: 'center',
    effect: isPrimary ? glassShadow() : undefined,
  }, [
    txt(label, { size: 14, fill: isPrimary ? '#FFFFFF' : C.neutral900, weight: '600' }),
  ]);
}

function input(placeholder, w = 'fill_container') {
  return frame('SearchInput', w, 48, {
    layout: 'horizontal',
    fill: '#F1F5F9',
    cornerRadius: R_PILL,
    padding: [12, 20],
    gap: 8,
    alignItems: 'center',
  }, [
    { type: 'icon_font', id: uid('ic'), width: 20, height: 20, iconFontName: 'search', iconFontFamily: 'lucide', fill: C.neutral600 },
    txt(placeholder, { size: 14, fill: C.neutral600 }),
  ]);
}

function appHeader(variant = 'mobile') {
  const h = variant === 'mobile' ? 56 : 64;
  return frame('AppHeader', 'fill_container', h, {
    layout: 'horizontal',
    fill: C.surface,
    stroke: { align: 'inside', thickness: { bottom: 1 }, fill: C.neutral200 },
    padding: variant === 'mobile' ? [0, 16] : [0, 32],
    alignItems: 'center',
  }, [
    frame('Logo', null, null, { layout: 'horizontal', gap: 0, alignItems: 'center' }, [
      txt('Fatal', { size: 20, fill: C.primary, weight: '700' }),
      txt('Trainer', { size: 20, fill: C.neutral900, weight: '700' }),
    ]),
  ]);
}

function trainerCard({ name, profession, price, rating, reviews, modality, initials, avatarColor }) {
  return frame(`Row ${name}`, 'fill_container', 88, {
    layout: 'horizontal',
    gap: 16,
    alignItems: 'center',
    stroke: { align: 'inside', thickness: { bottom: 1 }, fill: C.neutral200 },
    fill: C.surface,
    padding: [16, 0],
  }, [
    avatar(initials, avatarColor, 72),
    frame('CardBody', 'fill_container', null, { layout: 'vertical', gap: 2 }, [
      frame('TopRow', 'fill_container', null, { layout: 'horizontal', justifyContent: 'space_between', alignItems: 'center' }, [
        txt(profession, { size: 12, fill: '#94A3B8' }),
        frame('Rating', null, null, { layout: 'horizontal', gap: 4, alignItems: 'center' }, [
          { type: 'icon_font', id: uid('st'), width: 14, height: 14, iconFontName: 'star', iconFontFamily: 'lucide', fill: C.rating },
          txt(`${rating} (${reviews})`, { size: 13, weight: '500' }),
        ]),
      ]),
      txt(name, { size: 18, weight: '700' }),
      txt(`${modality} • Funcional`, { size: 14, fill: C.neutral600 }),
      frame('PriceRow', null, null, { layout: 'horizontal', gap: 6, alignItems: 'baseline' }, [
        txt(price.replace('/sessão', ''), { size: 16, weight: '700', fill: C.primary }),
        txt('por sessão', { size: 12, fill: '#94A3B8' }),
      ]),
    ]),
  ]);
}

function linearGradientFill(angleColors) {
  return {
    type: 'gradient',
    gradientType: 'linear',
    enabled: true,
    opacity: 1,
    rotation: 135,
    colors: angleColors,
  };
}

function carouselDots(count = 6, activeIndex = count - 1) {
  return frame('FTCarouselDots', null, null, {
    layout: 'horizontal',
    gap: 6,
    alignItems: 'center',
    reusable: true,
  }, Array.from({ length: count }, (_, index) => {
    const isActive = index === activeIndex;
    return frame(`Dot ${index + 1}`, isActive ? 14 : 10, isActive ? 14 : 10, {
      layout: 'none',
      fill: isActive ? '#FFFFFF00' : '#FFFFFF59',
      cornerRadius: 999,
      stroke: isActive ? border('#FFFFFF') : undefined,
      alignItems: 'center',
      justifyContent: 'center',
    }, isActive ? [{
      type: 'ellipse',
      id: uid('dot'),
      width: 6,
      height: 6,
      fill: '#FFFFFF',
    }] : []);
  }));
}

function featuredTrainerCard(trainer = {
  name: 'Ana Silva',
  profession: 'Personal — Funcional',
  reviews: '127',
}, activeIndex = 5, slideCount = 6) {
  return frame('FTFeaturedTrainerCard', 'fill_container', 420, {
    layout: 'none',
    fill: linearGradientFill([
      { color: C.featuredGradientStart, position: 0 },
      { color: C.featuredGradientEnd, position: 1 },
    ]),
    cornerRadius: 24,
    clip: true,
    reusable: true,
  }, [
    {
      type: 'rectangle',
      id: uid('photo'),
      x: 150,
      y: 0,
      width: 220,
      height: 420,
      fill: '#FFFFFF33',
    },
    frame('Overlay', 'fill_container', 'fill_container', {
      layout: 'vertical',
      justifyContent: 'space_between',
      padding: 24,
      fill: '#00000000',
    }, [
      frame('Top', 'fill_container', null, { layout: 'horizontal', justifyContent: 'space_between', alignItems: 'flex-start', gap: 12 }, [
        frame('Titles', 'fill_container', null, { layout: 'vertical', gap: 4 }, [
          txt(trainer.name, { size: 18, weight: '700', fill: '#FFFFFF' }),
          txt(trainer.profession.replace('Personal — ', ''), { size: 13, fill: '#FFFFFFCC' }),
        ]),
        carouselDots(slideCount, activeIndex),
      ]),
      frame('Social', null, null, { layout: 'horizontal', gap: 12, alignItems: 'center' }, [
        frame('Avatars', null, null, { layout: 'horizontal', gap: -8 }, [
          avatar('MS', '#FFFFFF33', 32),
          avatar('JL', '#FFFFFF33', 32),
          avatar('CM', '#FFFFFF33', 32),
        ]),
        frame('Stats', null, null, { layout: 'vertical', gap: 2 }, [
          txt(`${trainer.reviews}+`, { size: 14, weight: '700', fill: '#FFFFFF' }),
          txt('Avaliações', { size: 11, fill: '#FFFFFFBF' }),
        ]),
      ]),
      frame('Bottom', 'fill_container', null, { layout: 'horizontal', justifyContent: 'space_between', alignItems: 'flex-end', gap: 16 }, [
        txt('Personal dedicado a resultados sustentáveis, com foco em técnica.', {
          size: 20,
          weight: '700',
          fill: '#FFFFFF',
          width: 220,
        }),
        frame('CTA', 56, 56, {
          layout: 'horizontal',
          alignItems: 'center',
          justifyContent: 'center',
          stroke: border('#FFFFFF99'),
          cornerRadius: 999,
        }, [
          { type: 'icon_font', id: uid('ic'), width: 20, height: 20, iconFontName: 'arrow-up-right', iconFontFamily: 'lucide', fill: '#FFFFFF' },
        ]),
      ]),
    ]),
  ]);
}

function featuredCarouselCard(trainer) {
  return featuredTrainerCard(trainer ?? {
    name: 'Ana Silva',
    profession: 'Personal — Funcional',
    reviews: '127',
  }, 5, 6);
}

function skeletonCard() {
  return frame('SkeletonRow', 'fill_container', 88, {
    layout: 'horizontal',
    gap: 16,
    alignItems: 'center',
    stroke: { align: 'inside', thickness: { bottom: 1 }, fill: C.neutral200 },
    fill: C.surface,
    padding: [16, 0],
  }, [
    { type: 'rectangle', id: uid('sk'), width: 72, height: 72, cornerRadius: 16, fill: C.skeletonMuted },
    frame('SkBody', 'fill_container', null, { layout: 'vertical', gap: 8 }, [
      { type: 'rectangle', id: uid('sk'), width: 'fill_container', height: 14, cornerRadius: 4, fill: C.skeletonMuted },
      { type: 'rectangle', id: uid('sk'), width: 'fill_container', height: 12, cornerRadius: 4, fill: C.skeletonMuted },
      { type: 'rectangle', id: uid('sk'), width: 120, height: 14, cornerRadius: 4, fill: C.skeletonMuted },
    ]),
  ]);
}

function filterSidebar() {
  return frame('FilterSidebar', 280, 'fill_container', {
    layout: 'vertical',
    gap: 20,
    padding: 0,
    fill: C.surface,
  }, [
    txt('Filtros', { size: 18, weight: '600' }),
    frame('PriceFilter', 'fill_container', null, { layout: 'vertical', gap: 8 }, [
      txt('Preço por sessão (R$)', { size: 13, fill: C.neutral600, weight: '500' }),
      frame('PriceRow', 'fill_container', null, { layout: 'horizontal', gap: 8 }, [
        input('Mín', 100),
        input('Máx', 100),
      ]),
    ]),
    frame('SpecFilter', 'fill_container', null, { layout: 'vertical', gap: 8 }, [
      txt('Especialidade', { size: 13, fill: C.neutral600, weight: '500' }),
      ...['Musculação', 'Funcional', 'CrossFit', 'HIIT'].map((s) =>
        frame(`Check ${s}`, 'fill_container', null, { layout: 'horizontal', gap: 8, alignItems: 'center' }, [
          { type: 'rectangle', id: uid('cb'), width: 18, height: 18, cornerRadius: 4, stroke: border(C.neutral200), fill: s === 'Funcional' ? C.primary : C.surface },
          txt(s, { size: 14 }),
        ]),
      ),
    ]),
    frame('ModFilter', 'fill_container', null, { layout: 'vertical', gap: 8 }, [
      txt('Modalidade', { size: 13, fill: C.neutral600, weight: '500' }),
      ...['Presencial', 'Online', 'Híbrido'].map((s) =>
        frame(`Check ${s}`, 'fill_container', null, { layout: 'horizontal', gap: 8, alignItems: 'center' }, [
          { type: 'rectangle', id: uid('cb'), width: 18, height: 18, cornerRadius: 4, stroke: border(C.neutral200), fill: s === 'Presencial' ? C.primary : C.surface },
          txt(s, { size: 14 }),
        ]),
      ),
    ]),
    btn('Limpar filtros', 'ghost', 'fill_container'),
  ]);
}

function catalogToolbar(showFiltersBtn = true) {
  return frame('Toolbar', 'fill_container', null, { layout: 'vertical', gap: 12 }, [
    input('Buscar por nome ou especialidade'),
    frame('Actions', 'fill_container', null, { layout: 'horizontal', gap: 8 }, [
      ...(showFiltersBtn ? [btn('Filtros ▾', 'secondary', 120)] : []),
      btn('Ordenar ▾', 'secondary', 120),
    ]),
    frame('Chips', 'fill_container', null, { layout: 'horizontal', gap: 8 }, [
      chip('Funcional'),
      chip('Presencial'),
    ]),
    txt('42 personal trainers', { size: 14, fill: C.neutral600 }),
  ]);
}

function loadMoreFooter(text = 'Carregando...') {
  return frame('LoadMore', 'fill_container', 48, {
    layout: 'horizontal',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
  }, [
    ...(text === 'Carregando...'
      ? [{ type: 'ellipse', id: uid('sp'), width: 20, height: 20, stroke: { align: 'inside', thickness: 2, fill: C.primary } }]
      : []),
    txt(text, { size: 13, fill: C.neutral600 }),
  ]);
}

function emptyState(title, cta) {
  return frame('EmptyState', 'fill_container', 280, {
    layout: 'vertical',
    gap: 16,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 48,
    fill: C.surface,
  }, [
    { type: 'icon_font', id: uid('ic'), width: 48, height: 48, iconFontName: 'search-x', iconFontFamily: 'lucide', fill: C.neutral600 },
    txt(title, { size: 16, weight: '600', fill: C.neutral900 }),
    btn(cta, 'primary', 180),
  ]);
}

function errorState(title, subtitle = null) {
  const children = [
    { type: 'icon_font', id: uid('ic'), width: 48, height: 48, iconFontName: 'alert-circle', iconFontFamily: 'lucide', fill: C.error },
    txt(title, { size: 16, weight: '600', fill: C.error }),
    btn('Tentar novamente', 'primary', 180),
  ];
  if (subtitle) children.splice(3, 0, txt(subtitle, { size: 14, fill: C.neutral600 }));
  return frame('ErrorState', 'fill_container', 240, {
    layout: 'vertical',
    gap: 16,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 48,
    fill: C.surface,
  }, children);
}

function screen(name, w, h, x, y, contentChildren) {
  return frame(name, w, h, {
    x,
    y,
    fill: C.surface,
    layout: 'none',
    clip: true,
  }, [
    frame('ScreenContent', w, h, {
      x: 0,
      y: 0,
      layout: 'vertical',
      fill: C.surface,
      clip: false,
    }, contentChildren),
  ]);
}

function floatBtn(icon) {
  return frame('FloatBtn', 44, 44, {
    layout: 'none',
    fill: C.surface,
    cornerRadius: 12,
    stroke: border(C.neutral200),
    effect: [{ type: 'shadow', shadowType: 'outer', color: '#0F172A0F', offset: { x: 0, y: 1 }, blur: 3 }],
  }, [
    { type: 'icon_font', id: uid('ic'), x: 12, y: 12, width: 20, height: 20, iconFontName: icon, iconFontFamily: 'lucide', fill: C.neutral900 },
  ]);
}

function filterFab() {
  return frame('FilterFab', 140, 52, {
    layout: 'horizontal',
    fill: C.primary,
    cornerRadius: 26,
    padding: [14, 24],
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
    effect: [{ type: 'shadow', shadowType: 'outer', color: '#7C3AED59', offset: { x: 0, y: 4 }, blur: 16 }],
  }, [
    { type: 'icon_font', id: uid('ic'), width: 20, height: 20, iconFontName: 'sliders-horizontal', iconFontFamily: 'lucide', fill: '#FFFFFF' },
    txt('Filtros', { size: 14, fill: '#FFFFFF', weight: '700' }),
  ]);
}

function profileHeroMobile() {
  return frame('ProfileHero', 'fill_container', null, { layout: 'vertical', gap: 0 }, [
    frame('HeroArea', 'fill_container', 320, { layout: 'none', clip: true }, [
      { type: 'rectangle', id: uid('ph'), x: 0, y: 0, width: 'fill_container', height: 320, fill: '#CBD5E1' },
      frame('FloatBack', null, null, { x: 16, y: 16, layout: 'none' }, [floatBtn('arrow-left')]),
      frame('FloatActions', null, null, { x: 275, y: 16, layout: 'horizontal', gap: 8 }, [
        floatBtn('message-circle'),
        floatBtn('heart'),
      ]),
    ]),
    frame('ProfileSheet', 'fill_container', null, {
      layout: 'vertical',
      gap: 8,
      cornerRadius: [24, 24, 0, 0],
      padding: [20, 20, 24, 20],
      fill: C.surface,
    }, [
      frame('MetaRow', 'fill_container', null, { layout: 'horizontal', justifyContent: 'space_between', alignItems: 'center' }, [
        txt('Personal — Funcional', { size: 12, fill: '#94A3B8' }),
        frame('Rating', null, null, { layout: 'horizontal', gap: 4, alignItems: 'center' }, [
          { type: 'icon_font', id: uid('st'), width: 14, height: 14, iconFontName: 'star', iconFontFamily: 'lucide', fill: C.rating },
          txt('4,8 (127)', { size: 13, weight: '500' }),
        ]),
      ]),
      txt('Ana Silva', { size: 24, weight: '700' }),
      txt('Presencial/Online • Funcional', { size: 14, fill: C.neutral600 }),
      frame('PriceRow', null, null, { layout: 'horizontal', gap: 6, alignItems: 'baseline' }, [
        txt('R$ 120,00', { size: 24, weight: '700', fill: C.primary }),
        txt('por sessão', { size: 12, fill: '#94A3B8' }),
      ]),
    ]),
  ]);
}

function profileSection(title, content, isChips = false) {
  const body = isChips
    ? txt(content.join(' · '), { size: 14, fill: C.neutral600 })
    : typeof content === 'string'
      ? txt(content, { size: 14, fill: C.neutral600 })
      : frame('Content', 'fill_container', null, { layout: 'vertical', gap: 8 }, content);
  return frame(`Section ${title}`, 'fill_container', null, {
    layout: 'vertical',
    gap: 12,
    padding: [24, 20],
    fill: C.surface,
    stroke: { align: 'inside', thickness: { top: 1 }, fill: C.neutral200 },
  }, [
    txt(title, { size: 18, weight: '600' }),
    body,
  ]);
}

function profileLocationRow() {
  return profileSection('Detalhes da localização', [
    frame('LocationRow', 'fill_container', null, { layout: 'horizontal', gap: 12, alignItems: 'center' }, [
      { type: 'rectangle', id: uid('loc'), width: 48, height: 48, cornerRadius: 12, fill: '#CBD5E1' },
      frame('LocText', 'fill_container', null, { layout: 'vertical', gap: 2 }, [
        txt('Personal — Funcional', { size: 14, weight: '600' }),
        txt('São Paulo, SP', { size: 13, fill: C.neutral600 }),
      ]),
      floatBtn('info'),
    ]),
  ]);
}

function profileReviewItem(author, rating, comment) {
  return frame(`Review ${author}`, 'fill_container', null, {
    layout: 'horizontal',
    gap: 12,
    padding: [16, 0],
    stroke: { align: 'inside', thickness: { bottom: 1 }, fill: C.neutral200 },
    fill: C.surface,
  }, [
    frame('Avatar', 40, 40, {
      layout: 'none',
      fill: C.surface,
      cornerRadius: 20,
      stroke: border(C.neutral200),
    }, [
      txt(author.charAt(0), { size: 14, weight: '600', fill: C.neutral600, x: 14, y: 10 }),
    ]),
    frame('ReviewBody', 'fill_container', null, { layout: 'vertical', gap: 8 }, [
      frame('ReviewHead', 'fill_container', null, { layout: 'horizontal', justifyContent: 'space_between', alignItems: 'center' }, [
        txt(author, { size: 14, weight: '600' }),
        frame('Stars', null, null, { layout: 'horizontal', gap: 2, alignItems: 'center' }, [
          txt(rating, { size: 13, weight: '500' }),
          { type: 'icon_font', id: uid('st'), width: 12, height: 12, iconFontName: 'star', iconFontFamily: 'lucide', fill: C.rating },
        ]),
      ]),
      txt(comment, { size: 13, fill: C.neutral600 }),
    ]),
  ]);
}

function profileCtaBar() {
  return frame('ProfileCta', 'fill_container', 88, {
    layout: 'vertical',
    fill: C.surface,
    stroke: { align: 'inside', thickness: { top: 1 }, fill: C.neutral200 },
    padding: [16, 20],
    justifyContent: 'center',
  }, [
    btn('Contratar personal', 'primary', 'fill_container'),
  ]);
}

function filterSlideover() {
  return frame('Slideover', 'fill_container', 'fill_container', {
    layout: 'vertical',
    fill: '#0F172A66',
    justifyContent: 'flex_end',
    x: 0,
    y: 0,
  }, [
    frame('Sheet', 'fill_container', 400, {
      layout: 'vertical',
      gap: 16,
      cornerRadius: [24, 24, 0, 0],
      padding: [16, 20, 24, 20],
      fill: C.surface,
    }, [
      frame('Handle', 40, 4, { fill: C.neutral200, cornerRadius: 2 }),
      frame('SheetHeader', 'fill_container', null, { layout: 'horizontal', justifyContent: 'space_between', alignItems: 'center' }, [
        txt('Filtros', { size: 20, weight: '600' }),
        { type: 'icon_font', id: uid('ic'), width: 24, height: 24, iconFontName: 'x', iconFontFamily: 'lucide', fill: C.neutral600 },
      ]),
      frame('SheetBody', 'fill_container', null, { layout: 'vertical', gap: 20 }, filterSidebar().children.slice(1)),
      btn('Aplicar filtros', 'primary', 'fill_container'),
    ]),
  ]);
}

function sortDropdown() {
  const options = ['Nome', 'Preço', 'Avaliação', 'Distância'];
  return frame('SortDropdown', 200, null, {
    layout: 'vertical',
    gap: 4,
    padding: 8,
    fill: C.surface,
    stroke: border(C.neutral200),
    cornerRadius: 16,
  }, options.map((o, i) =>
    frame(`Opt ${o}`, 'fill_container', 40, {
      layout: 'horizontal',
      fill: i === 0 ? C.primarySubtle : 'transparent',
      padding: [8, 12],
      alignItems: 'center',
      cornerRadius: 12,
    }, [
      txt(o, { size: 14, fill: i === 0 ? C.primary : C.neutral900, weight: i === 0 ? '600' : 'normal' }),
    ]),
  ));
}

function profileHeroDesktop() {
  return frame('HeroDesktop', 'fill_container', null, {
    layout: 'horizontal',
    gap: 32,
    fill: C.surface,
  }, [
    { type: 'rectangle', id: uid('ph'), width: 288, height: 288, cornerRadius: 24, fill: '#CBD5E1' },
    frame('HeroInfo', 'fill_container', null, { layout: 'vertical', gap: 8, justifyContent: 'center' }, [
      frame('Actions', null, null, { layout: 'horizontal', gap: 8 }, [
        floatBtn('arrow-left'),
        floatBtn('message-circle'),
        floatBtn('heart'),
      ]),
      frame('MetaRow', 'fill_container', null, { layout: 'horizontal', justifyContent: 'space_between', alignItems: 'center' }, [
        txt('Personal — Funcional', { size: 12, fill: '#94A3B8' }),
        frame('Rating', null, null, { layout: 'horizontal', gap: 4, alignItems: 'center' }, [
          { type: 'icon_font', id: uid('st'), width: 14, height: 14, iconFontName: 'star', iconFontFamily: 'lucide', fill: C.rating },
          txt('4,8 (127)', { size: 13, weight: '500' }),
        ]),
      ]),
      txt('Ana Silva', { size: 32, weight: '700' }),
      txt('Presencial/Online • Funcional', { size: 14, fill: C.neutral600 }),
      frame('PriceRow', null, null, { layout: 'horizontal', gap: 6, alignItems: 'baseline' }, [
        txt('R$ 120,00', { size: 24, weight: '700', fill: C.primary }),
        txt('por sessão', { size: 12, fill: '#94A3B8' }),
      ]),
    ]),
  ]);
}

const trainers = [
  { name: 'Ana Silva', profession: 'Personal — Funcional', price: 'R$ 120,00/sessão', rating: '4,8', reviews: '127', distance: '2,3 km', modality: 'Presencial', initials: 'AS', avatarColor: '#7C3AED' },
  { name: 'Marcos Oliveira', profession: 'Personal — CrossFit', price: 'R$ 95,00/sessão', rating: '4,5', reviews: '89', distance: '5,1 km', modality: 'Presencial', initials: 'MO', avatarColor: '#6366F1' },
  { name: 'Rafael Costa', profession: 'Personal — Funcional', price: 'R$ 110,00/sessão', rating: '4,9', reviews: '203', distance: '1,8 km', modality: 'Híbrido', initials: 'RC', avatarColor: '#2563EB' },
  { name: 'Julia Mendes', profession: 'Personal — HIIT', price: 'R$ 130,00/sessão', rating: '4,7', reviews: '56', distance: '3,4 km', modality: 'Online', initials: 'JM', avatarColor: '#DB2777' },
];

function catalogMobileContent(opts = {}) {
  const { cards = trainers.slice(0, 3), footer = loadMoreFooter(), middle = null, showFilters = true, showFeatured = true } = opts;
  return [
    appHeader('mobile'),
    frame('Content', 'fill_container', 'fill_container', { layout: 'vertical', gap: 16, padding: 16, fill: C.surface }, [
      ...(showFeatured ? [featuredCarouselCard()] : []),
      frame('PageTitle', 'fill_container', null, { layout: 'vertical', gap: 2, alignItems: 'center' }, [
        txt('Explorar personais', { size: 22, weight: '700' }),
        txt('Brasil', { size: 13, fill: '#94A3B8' }),
      ]),
      input('Buscar...'),
      middle ?? frame('List', 'fill_container', null, { layout: 'vertical', gap: 0 }, cards.map((t) => trainerCard(t))),
      footer,
    ]),
    frame('FabWrap', null, null, { x: 118, y: 740, layout: 'none' }, [filterFab()]),
  ];
}

const t01Mobile = screen('T-01 / Catalogo / Mobile', 375, 812, 0, 0, catalogMobileContent());

const t01Desktop = screen('T-01 / Catalogo / Desktop', 1440, 900, 0, 900, [
  appHeader('desktop'),
  frame('FeaturedWrap', 'fill_container', null, { layout: 'vertical', padding: [16, 32, 0, 32], fill: C.surface }, [
    featuredCarouselCard(),
  ]),
  frame('Body', 'fill_container', 'fill_container', { layout: 'horizontal', fill: C.surface }, [
    frame('SidebarWrap', 280, 'fill_container', { layout: 'vertical', padding: [24, 0, 24, 32], fill: C.surface }, [
      filterSidebar(),
    ]),
    frame('Main', 'fill_container', 'fill_container', { layout: 'vertical', gap: 16, padding: 24, fill: C.surface }, [
      frame('PageTitle', 'fill_container', null, { layout: 'vertical', gap: 2 }, [
        txt('Explorar personais', { size: 28, weight: '700' }),
        txt('Brasil', { size: 14, fill: '#94A3B8' }),
      ]),
      input('Buscar...'),
      frame('List', 'fill_container', null, { layout: 'vertical', gap: 0 }, trainers.map((t) => trainerCard(t))),
      loadMoreFooter(),
    ]),
  ]),
]);

const t02Mobile = screen('T-02 / Perfil / Mobile', 375, 1300, 400, 0, [
  frame('ProfileContent', 'fill_container', 'fill_container', { layout: 'vertical', gap: 0, padding: [0, 0, 0, 0], fill: C.surface }, [
    profileHeroMobile(),
    profileLocationRow(),
    profileSection('Sobre', 'Personal trainer especializada em treino funcional para emagrecimento e condicionamento.'),
    profileSection('Especialidades', ['Funcional', 'Emagrecimento'], true),
    profileSection('Certificação', [
      frame('Cref', 'fill_container', null, { layout: 'horizontal', gap: 8, alignItems: 'center' }, [
        { type: 'icon_font', id: uid('ic'), width: 18, height: 18, iconFontName: 'shield-check', iconFontFamily: 'lucide', fill: C.primary },
        txt('CREF 012345-G/SP', { size: 14, weight: '500' }),
      ]),
    ]),
    frame('ReviewsSection', 'fill_container', null, {
      layout: 'vertical',
      gap: 0,
      padding: [24, 20],
      fill: C.surface,
      stroke: { align: 'inside', thickness: { top: 1 }, fill: C.neutral200 },
    }, [
      txt('Avaliações (127)', { size: 18, weight: '600' }),
      profileReviewItem('Maria', '4.8', '"Excelente profissional, muito atenciosa!"'),
      profileReviewItem('João', '5.0', '"Treinos desafiadores e resultados visíveis."'),
    ]),
    profileCtaBar(),
  ]),
]);

const t02Desktop = screen('T-02 / Perfil / Desktop', 1440, 900, 850, 900, [
  appHeader('desktop'),
  frame('ProfileWrap', 'fill_container', 'fill_container', { layout: 'vertical', gap: 0, padding: [24, 48], fill: C.surface }, [
    profileHeroDesktop(),
    profileLocationRow(),
    profileSection('Sobre', 'Personal trainer especializada em treino funcional para emagrecimento e condicionamento.'),
    profileSection('Especialidades', ['Funcional', 'Emagrecimento'], true),
    frame('ReviewsSection', 'fill_container', null, {
      layout: 'vertical',
      gap: 0,
      padding: [24, 0],
      fill: C.surface,
      stroke: { align: 'inside', thickness: { top: 1 }, fill: C.neutral200 },
    }, [
      txt('Avaliações (127)', { size: 18, weight: '600' }),
      profileReviewItem('Maria', '4.8', '"Excelente profissional!"'),
    ]),
  ]),
]);

function page404(name, w, h, x, y) {
  return screen(name, w, h, x, y, [
    appHeader(w <= 375 ? 'mobile' : 'desktop'),
    frame('Center', 'fill_container', 'fill_container', { layout: 'vertical', gap: 16, alignItems: 'center', justifyContent: 'center', fill: C.surface }, [
      txt('404', { size: 72, weight: '700', fill: C.primarySubtle }),
      txt('Personal trainer não encontrado', { size: 18, weight: '600' }),
      btn('Ver todos os personal trainers', 'primary', 280),
    ]),
  ]);
}

const t03Mobile = page404('T-03 / 404 / Mobile', 375, 812, 850, 0);
const t03Desktop = page404('T-03 / 404 / Desktop', 1440, 900, 0, 1900);

const o01 = screen('O-01 / Filtros / Mobile', 375, 812, 1250, 0, [
  ...catalogMobileContent({ cards: trainers.slice(0, 2), showFilters: true }),
  filterSlideover(),
]);

const o03 = screen('O-03 / Ordenacao / Dropdown', 375, 812, 1650, 0, [
  appHeader('mobile'),
  frame('Content', 'fill_container', 'fill_container', { layout: 'vertical', gap: 16, padding: 16, fill: C.surface }, [
    input('Buscar...'),
    frame('SortRow', 'fill_container', null, { layout: 'horizontal', gap: 8, alignItems: 'flex-start' }, [
      filterFab(),
      frame('SortWrap', 200, null, { layout: 'vertical', gap: 4 }, [sortDropdown()]),
    ]),
    frame('List', 'fill_container', null, { layout: 'vertical', gap: 0 }, trainers.slice(0, 2).map((t) => trainerCard(t))),
  ]),
]);

const s01Loading = screen('S-01 / Loading', 375, 812, 2050, 0, [
  appHeader('mobile'),
  frame('Content', 'fill_container', 'fill_container', { layout: 'vertical', gap: 16, padding: 16, fill: C.surface }, [
    featuredCarouselCard(),
    frame('PageTitle', 'fill_container', null, { layout: 'vertical', gap: 2, alignItems: 'center' }, [
      txt('Explorar personais', { size: 22, weight: '700' }),
      txt('Brasil', { size: 13, fill: '#94A3B8' }),
    ]),
    input('Buscar...'),
    frame('List', 'fill_container', null, { layout: 'vertical', gap: 0 }, Array.from({ length: 6 }, () => skeletonCard())),
  ]),
]);

const s01EmptyBusca = screen('S-01 / Empty / Busca', 375, 812, 2450, 0, [
  appHeader('mobile'),
  frame('Content', 'fill_container', 'fill_container', { layout: 'vertical', gap: 16, padding: 16, fill: C.surface }, [
    input('xyzabc'),
    emptyState('Nenhum personal trainer encontrado para «xyzabc»', 'Limpar busca'),
  ]),
]);

const s01EmptyFiltros = screen('S-01 / Empty / Filtros', 375, 812, 2850, 0, [
  appHeader('mobile'),
  frame('Content', 'fill_container', 'fill_container', { layout: 'vertical', gap: 16, padding: 16, fill: C.surface }, [
    input('Buscar...'),
    emptyState('Nenhum resultado com esses filtros', 'Limpar filtros'),
  ]),
]);

const s01ErroListagem = screen('S-01 / Erro / Listagem', 375, 812, 3250, 0, [
  appHeader('mobile'),
  frame('Content', 'fill_container', 'fill_container', { layout: 'vertical', gap: 16, padding: 16, fill: C.surface }, [
    input('Buscar...'),
    errorState('Não foi possível carregar os personal trainers.'),
  ]),
]);

const s01ErroPaginacao = screen('S-01 / Erro / Paginacao', 375, 812, 3650, 0, catalogMobileContent({
  cards: trainers.slice(0, 2),
  footer: frame('ErrFooter', 'fill_container', 48, { layout: 'horizontal', alignItems: 'center', justifyContent: 'center' }, [
    txt('Erro ao carregar mais. ', { size: 13, fill: C.neutral600 }),
    txt('Tentar novamente', { size: 13, fill: C.primary, weight: '600' }),
  ]),
}));

const s01ErroPerfil = screen('S-01 / Erro / Perfil', 375, 812, 4050, 0, [
  appHeader('mobile'),
  errorState('Não foi possível carregar este perfil.', 'Ver catálogo'),
]);

const s01FimLista = screen('S-01 / FimLista', 375, 812, 4450, 0, catalogMobileContent({
  cards: trainers.slice(0, 3),
  footer: loadMoreFooter('Você viu todos os personal trainers'),
}));

const componentsFrame = frame('Components / Design System', 400, 820, {
  x: -500,
  y: 0,
  layout: 'vertical',
  fill: C.surface,
  padding: 16,
  gap: 16,
}, [
  txt('Flat UI v1.2', { size: 16, weight: '700' }),
  appHeader('mobile'),
  input('Buscar...'),
  featuredTrainerCard(),
  carouselDots(),
  trainerCard(trainers[0]),
  skeletonCard(),
  floatBtn('arrow-left'),
  filterFab(),
  btn('Contratar personal', 'primary', 'fill_container'),
  emptyState('Empty example', 'CTA'),
]);

const doc = {
  version: '2.8',
  children: [
    componentsFrame,
    t01Mobile,
    t02Mobile,
    t03Mobile,
    o01,
    o03,
    s01Loading,
    s01EmptyBusca,
    s01EmptyFiltros,
    s01ErroListagem,
    s01ErroPaginacao,
    s01ErroPerfil,
    s01FimLista,
    t01Desktop,
    t02Desktop,
    t03Desktop,
  ],
  variables: {
    primary: { type: 'color', value: C.primary },
    primarySubtle: { type: 'color', value: C.primarySubtle },
    neutral900: { type: 'color', value: C.neutral900 },
    neutral600: { type: 'color', value: C.neutral600 },
    neutral200: { type: 'color', value: C.neutral200 },
    surface: { type: 'color', value: C.surface },
    error: { type: 'color', value: C.error },
    rating: { type: 'color', value: C.rating },
  },
};

writeFileSync(OUT, JSON.stringify(doc, null, 2));
console.log(`Generated ${OUT} with ${doc.children.length} top-level frames.`);
