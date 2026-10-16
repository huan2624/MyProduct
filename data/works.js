/* ============================================================
   作品列表 —— 这是你唯一需要经常修改的文件
   ------------------------------------------------------------
   新增一个作品：复制下面任意一段 { ... }，粘到列表里改内容即可。

   字段说明（带 * 的必填）：
     * id        唯一标识，不能重复，建议用英文短横线，如 "brand-04"
     * title     作品名
     * src       网格里显示的图片路径（建议宽度 800~1200px 的压缩图）
       category  分类名。相同分类名会自动合并成筛选按钮
       year      年份，数字
       full      点开大图时显示的图（建议 1600px 左右）。不填则用 src
       alt       图片描述，用于无障碍和 SEO。不填则用 title
       tags      标签数组，如 ["LOGO", "包装"]
       desc      一段说明，显示在大图下方
       ratio     网格里的显示比例，默认 "4 / 3"。想跨两列的大图用 "8 / 3"
       featured  true 表示这个作品在网格里占两列（宽幅展示）
   ============================================================ */

window.WORKS = [
  {
    id: 'brand-01',
    title: '晨光咖啡 · 品牌识别',
    category: '品牌识别',
    year: 2025,
    src: 'images/works/brand-01.svg',
    full: 'images/works/brand-01.svg',
    ratio: '4 / 3',
    tags: ['LOGO', '字体', '应用系统'],
    desc: '为一家社区咖啡品牌重做视觉识别，核心图形取自清晨斜射进窗的光斑。',
  },
  {
    id: 'brand-02',
    title: '山野茶事 · VI 系统',
    category: '品牌识别',
    year: 2024,
    src: 'images/works/brand-02.svg',
    full: 'images/works/brand-02.svg',
    ratio: '8 / 3',
    featured: true,
    tags: ['VI', '包装', '门店'],
    desc: '从山形轮廓提炼出连续的线条母题，延展到包装、门店与线上物料。',
  },
  {
    id: 'brand-03',
    title: '城方书店 · 标志与导视',
    category: '品牌识别',
    year: 2024,
    src: 'images/works/brand-03.svg',
    full: 'images/works/brand-03.svg',
    ratio: '4 / 3',
    tags: ['标志', '导视'],
    desc: '把书脊的秩序感做成模块化的导视语言。',
  },

  {
    id: 'poster-01',
    title: '城市噪音音乐节',
    category: '海报',
    year: 2025,
    src: 'images/works/poster-01.svg',
    full: 'images/works/poster-01.svg',
    ratio: '4 / 3',
    tags: ['主视觉', '延展'],
    desc: '用声波的错位叠印表现现场的嘈杂与能量。',
  },
  {
    id: 'poster-02',
    title: '无声 · 电影海报系列',
    category: '海报',
    year: 2024,
    src: 'images/works/poster-02.svg',
    full: 'images/works/poster-02.svg',
    ratio: '4 / 3',
    tags: ['系列', '黑白'],
    desc: '去掉一切装饰，只留下一个被压扁的瞬间。',
  },
  {
    id: 'poster-03',
    title: '二十四节气 · 展览海报',
    category: '海报',
    year: 2023,
    src: 'images/works/poster-03.svg',
    full: 'images/works/poster-03.svg',
    ratio: '8 / 3',
    featured: true,
    tags: ['展览', '东方'],
    desc: '以土色系与留白，把节气还原成一组呼吸的节奏。',
  },

  {
    id: 'illus-01',
    title: '折叠的夏天',
    category: '插画',
    year: 2025,
    src: 'images/works/illus-01.svg',
    full: 'images/works/illus-01.svg',
    ratio: '4 / 3',
    tags: ['数码绘画'],
    desc: '夏日记忆里被晒到发白的颜色。',
  },
  {
    id: 'illus-02',
    title: '城市漫游者',
    category: '插画',
    year: 2024,
    src: 'images/works/illus-02.svg',
    full: 'images/works/illus-02.svg',
    ratio: '4 / 3',
    tags: ['系列', '夜景'],
    desc: '夜晚的楼与影，以及走在其中的人。',
  },
  {
    id: 'illus-03',
    title: '深海来信',
    category: '插画',
    year: 2023,
    src: 'images/works/illus-03.svg',
    full: 'images/works/illus-03.svg',
    ratio: '8 / 3',
    featured: true,
    tags: ['长卷'],
    desc: '一条从海面延伸到海床的横构图长幅。',
  },

  {
    id: 'pkg-01',
    title: '白露 · 米酒包装',
    category: '包装',
    year: 2025,
    src: 'images/works/pkg-01.svg',
    full: 'images/works/pkg-01.svg',
    ratio: '4 / 3',
    tags: ['瓶标', '礼盒'],
    desc: '用一枚露珠形的水印标记产品线的起点。',
  },
  {
    id: 'pkg-02',
    title: '一颗好坚果 · 礼盒',
    category: '包装',
    year: 2024,
    src: 'images/works/pkg-02.svg',
    full: 'images/works/pkg-02.svg',
    ratio: '4 / 3',
    tags: ['礼盒', '插画'],
    desc: '把产地画进盒面，让开箱成为一次产地旅行。',
  },
  {
    id: 'pkg-03',
    title: '三时茶 · 茶叶罐',
    category: '包装',
    year: 2023,
    src: 'images/works/pkg-03.svg',
    full: 'images/works/pkg-03.svg',
    ratio: '4 / 3',
    tags: ['罐体', '结构'],
    desc: '三个时段三种浓度，用色阶区分早中晚。',
  },
];

/* 想让筛选按钮按固定顺序排列，可以在下面列出分类名（不写也没关系，会自动按作品顺序生成）：
   window.CATEGORY_ORDER = ['品牌识别', '海报', '插画', '包装'];
*/
