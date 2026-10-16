/**
 * 生成示例占位图（SVG）。
 * 用途：在你还没有整理好真实作品前，让网站能有内容预览。
 * 用法：node tools/generate-placeholders.mjs
 * 说明：放上真实作品后，直接删除 images/works 下的 .svg 即可。
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(here, '..', 'images', 'works');

// 网格比例 -> 像素尺寸
const SIZES = {
  '4 / 3': [1600, 1200],
  '8 / 3': [2400, 900],
  '3 / 4': [1200, 1600],
  '1 / 1': [1400, 1400],
};

// 与 data/works.js 中的 id 一一对应
const works = [
  { id: 'brand-01',  title: '晨光咖啡 · 品牌识别',    ratio: '4 / 3', c1: '#FF8A5B', c2: '#C6423A' },
  { id: 'brand-02',  title: '山野茶事 · VI 系统',      ratio: '8 / 3', c1: '#7BAE7F', c2: '#2E4B3C' },
  { id: 'brand-03',  title: '城方书店 · 标志与导视',   ratio: '4 / 3', c1: '#8AA6D6', c2: '#2B3A63' },
  { id: 'poster-01', title: '城市噪音音乐节',          ratio: '4 / 3', c1: '#F2C14E', c2: '#8C3B00' },
  { id: 'poster-02', title: '无声 · 电影海报系列',     ratio: '4 / 3', c1: '#6E6E76', c2: '#16161C' },
  { id: 'poster-03', title: '二十四节气 · 展览海报',   ratio: '8 / 3', c1: '#D7BFA8', c2: '#6B4B33' },
  { id: 'illus-01',  title: '折叠的夏天',              ratio: '4 / 3', c1: '#FFD36E', c2: '#FF6B6B' },
  { id: 'illus-02',  title: '城市漫游者',              ratio: '4 / 3', c1: '#A78BFA', c2: '#312E81' },
  { id: 'illus-03',  title: '深海来信',                ratio: '8 / 3', c1: '#4FB3D9', c2: '#0B2545' },
  { id: 'pkg-01',    title: '白露 · 米酒包装',         ratio: '4 / 3', c1: '#E8D9B5', c2: '#8A6A3B' },
  { id: 'pkg-02',    title: '一颗好坚果 · 礼盒',       ratio: '4 / 3', c1: '#F0A868', c2: '#7A3E12' },
  { id: 'pkg-03',    title: '三时茶 · 茶叶罐',         ratio: '4 / 3', c1: '#9CC5A1', c2: '#1F3A2E' },
];

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function shapes(i, w, h) {
  const c = 'rgba(255,255,255,';
  switch (i % 4) {
    case 0:
      return `
  <circle cx="${w * 0.78}" cy="${h * 0.28}" r="${h * 0.34}" fill="${c}0.14)"/>
  <circle cx="${w * 0.66}" cy="${h * 0.58}" r="${h * 0.2}" fill="${c}0.1)"/>`;
    case 1: {
      const u = h * 0.16;
      let out = '';
      for (let k = 0; k < 5; k++) {
        out += `\n  <rect x="${w * 0.55 + k * u * 1.15}" y="${h * 0.16}" width="${u}" height="${u}" rx="${u * 0.12}" fill="${c}${0.05 + k * 0.03})" transform="rotate(18 ${w * 0.55 + k * u * 1.15 + u / 2} ${h * 0.16 + u / 2})"/>`;
      }
      return out;
    }
    case 2: {
      let out = '';
      for (let k = 0; k < 7; k++) {
        out += `\n  <line x1="${w * 0.5 + k * h * 0.11}" y1="${h}" x2="${w * 0.72 + k * h * 0.11}" y2="0" stroke="${c}0.07)" stroke-width="${h * 0.035}"/>`;
      }
      return out;
    }
    default:
      return `
  <circle cx="${w * 0.72}" cy="${h * 0.5}" r="${h * 0.42}" fill="none" stroke="${c}0.13)" stroke-width="${h * 0.035}"/>
  <circle cx="${w * 0.72}" cy="${h * 0.5}" r="${h * 0.27}" fill="none" stroke="${c}0.16)" stroke-width="${h * 0.02}"/>
  <circle cx="${w * 0.72}" cy="${h * 0.5}" r="${h * 0.1}" fill="${c}0.22)"/>`;
  }
}

mkdirSync(outDir, { recursive: true });

works.forEach((wk, i) => {
  const [w, h] = SIZES[wk.ratio] || SIZES['4 / 3'];
  const pad = Math.round(h * 0.075);
  const fs = Math.round(h * (wk.ratio === '8 / 3' ? 0.085 : 0.062));
  const small = Math.round(h * 0.026);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${esc(wk.title)}（示例占位图）">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${wk.c1}"/>
      <stop offset="1" stop-color="${wk.c2}"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#g)"/>${shapes(i, w, h)}
  <g font-family="'PingFang SC','Hiragino Sans GB','Microsoft YaHei',system-ui,sans-serif" fill="#ffffff">
    <text x="${pad}" y="${pad + small}" font-size="${small}" fill-opacity="0.72" letter-spacing="${small * 0.12}">PLACEHOLDER · 请替换为你的作品</text>
    <text x="${pad}" y="${h - pad}" font-size="${fs}" font-weight="600" fill-opacity="0.95">${esc(wk.title)}</text>
  </g>
</svg>
`;

  const file = resolve(outDir, `${wk.id}.svg`);
  writeFileSync(file, svg, 'utf8');
});

console.log(`已生成 ${works.length} 张示例占位图 -> images/works/`);
