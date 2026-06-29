# Codex 指令：将 /cases 页面改造成 DMK 风格的 Before/After 展示页

**参考**：https://www.dmkskinrevisionclinic.com.au/before-and-afters  
**项目路径**：`C:\Users\Administrator\Documents\Codex\2026-06-17\codex-tasks-md-task001-task\enzyme-skincare`

---

## 设计要求

将现有的 `/cases` 页面改造成 DMK 风格的 Results 页面。  
DMK 页面的核心特征：

1. **顶部筛选栏** — 按皮肤问题/治疗类型分类的筛选按钮
2. **图片网格** — 每张卡片都是 Before/After 对比图 + 标签
3. **标签样式** — "Before" 和 "After" 文字直接标在图片上
4. **卡片信息** — 图片下方显示客户皮肤问题、治疗类型、简短描述
5. **点击放大** — 点击图片可以查看大图（用现有 Modal 组件即可）

---

## 具体修改

### 文件 1：`src/app/cases/page.tsx` — 重写为 DMK 风格

```tsx
// Cases 页面 — DMK Before/After 风格
// 保留从 Prisma 获取数据，但页面布局改为画廊模式

import { Suspense } from "react";
import type { Metadata } from "next";
import { getCaseStudies } from "@/lib/supabase/queries";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Before & After Results | Enzyme Skincare",
  description: "Real results from real clients. Browse our before and after photo gallery to see the transformative power of enzyme skincare.",
};

// 筛选分类（从 DMK 页面借鉴）
const FILTERS = [
  { value: "all", label: "All Results" },
  { value: "acne", label: "Acne" },
  { value: "aging", label: "Aging" },
  { value: "pigmentation", label: "Pigmentation" },
  { value: "dryness", label: "Dryness" },
];

export default async function CasesPage() {
  const result = await getCaseStudies();
  const cases = result || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* 页面标题 */}
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-heading font-bold mb-3">Before & After Results</h1>
        <p className="text-text-secondary max-w-2xl mx-auto">
          Real transformations from real clients. Each result showcases the power of enzyme-powered skincare.
        </p>
      </div>

      <Suspense>
        <CasesGallery cases={cases} />
      </Suspense>
    </div>
  );
}

function CasesGallery({ cases }: { cases: any[] }) {
  "use client";
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedCase, setSelectedCase] = useState<any>(null);
  // ... 客户端交互逻辑
  return (/* JSX */);
}
```

> 实际代码交给 Codex 做。关键点是 Before/After 图片并排展示 + 筛选栏 + 点击放大。

### 文件 2：`src/app/cases/[slug]/page.tsx` — 详情页保持现有

不需要改动。从列表页点击卡片进入详情页。

### 文件 3（可选新增）：`src/components/cases/BeforeAfterCard.tsx`

如果 Codex 觉得有必要抽成独立组件，就新建这个文件。

---

## 设计参考

### 布局骨架

```
┌─────────────────────────────────────────────────────┐
│           Before & After Results                     │
│           Real transformations from real clients.     │
├─────────────────────────────────────────────────────┤
│  [All Results] [Acne] [Aging] [Pigmentation] [Dryness] │
├─────────────────────────────────────────────────────┤
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐  │
│  │ BFR │AFT│ │ BFR │AFT│ │ BFR │AFT│ │ BFR │AFT│  │
│  │ img │img│ │ img │img│ │ img │img│ │ img │img│  │
│  ├─────────┤ ├─────────┤ ├─────────┤ ├─────────┤  │
│  │ Acne    │ │ Aging   │ │ Pigment │ │ Dryness │  │
│  │ 8 weeks │ │ 6 weeks │ │ 12 wks  │ │ 4 weeks │  │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘  │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐  │
│  │ BFR │AFT│ │ BFR │AFT│ │ BFR │AFT│ │ BFR │AFT│  │
│  │ img │img│ │ img │img│ │ img │img│ │ img │img│  │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘  │
└─────────────────────────────────────────────────────┘
```

### 图片卡片设计

```
┌──────────────────────┐
│  ┌──────┐ ┌──────┐   │
│  │      │ │      │   │
│  │ Before│ │ After│   │
│  │  img  │ │  img │   │
│  │      │ │      │   │
│  └──────┘ └──────┘   │
├──────────────────────┤
│  3-Year Hormonal     │
│  Acne — 8 Weeks      │
└──────────────────────┘
```

### 筛选按钮样式

- Pill 形状（圆角胶囊按钮）
- 选中时背景色为主色（teal），文字白色
- 未选中时灰色边框，灰色文字
- hover 效果

---

## 数据字段

当前 CaseStudy 模型中的字段：

| 字段 | 说明 |
|------|------|
| id | UUID |
| slug | URL |
| title | 标题 |
| clientName | 客户名 |
| skinConcern | 皮肤问题（数组） |
| treatmentDuration | 治疗时长（如 "8 weeks"） |
| description | 描述 |
| beforeImage | 对比前图片 URL |
| afterImage | 对比后图片 URL |
| productsUsed | 使用产品（关联 Product） |

---

## 交付物要求

1. **筛选栏**：按 skinConcern 分类（Acne / Aging / Pigmentation / Dryness / All）
2. **图片并排**：每个卡片左图 Before + 右图 After，宽度各 50%
3. **标签叠加**：图片左上角叠加 "BEFORE" 和 "AFTER" 文字标签
4. **卡片信息**：图片下方一行显示 title + treatmentDuration
5. **点击放大**：点击卡片用 Modal 展示大图（Before + After 完整对比）
6. **响应式**：桌面 4 列，平板 3 列，手机 2 列
7. **页面标题**：SEO 友好的标题和描述

---

## 验证

```bash
npm run build
# 确认 /cases 页面正常加载
# 确认筛选按钮切换正常
# 确认 Before/After 图片显示正确
```
