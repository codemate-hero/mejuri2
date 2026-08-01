# Shop Pages - Reusable Component System 🎯

Yeh system **fully reusable** hai! Ab aap easily naye pages bana sakte ho without code duplication.

## Structure

```
components/
  ShopLayout.tsx           ← Main reusable component
data/
  shopConfigs.ts          ← All page configurations
app/
  shop-all/page.tsx       ← Complex page (with hero sections)
  earrings/page.tsx       ← Simple page (no hero sections)
  rings/page.tsx          ← Coming soon...
```

## How to Create a New Page (3 Steps!)

### Step 1: Add Config in `data/shopConfigs.ts`

```typescript
export const ringsConfig: ShopPageConfig = {
  pageTitle: "RINGS",
  showCategoryTiles: false,
  heroSections: [], // Empty = simple grid
  seoDescription: "Discover our collection of fine gold rings...",
  maxPages: 5
};
```

### Step 2: Create Page File

```typescript
// app/rings/page.tsx
import { ShopLayout } from "@/components/ShopLayout";
import { ringsConfig } from "@/data/shopConfigs";

export default function RingsPage() {
  return <ShopLayout config={ringsConfig} />;
}
```

### Step 3: Done! 🎉

That's it! Sirf 3 lines ka page file!

## Two Types of Pages

### Type 1: Simple Category Page (No Hero Sections)
- Example: Earrings, Rings, Necklaces
- Direct product grid
- SEO description at bottom
- Configuration:
  ```typescript
  {
    pageTitle: "EARRINGS",
    showCategoryTiles: false,
    heroSections: []  // Empty!
  }
  ```

### Type 2: Collection Page (With Hero Sections)
- Example: Shop All, Collections
- Products + Editorial sections interleaved
- Category tiles at top
- Configuration:
  ```typescript
  {
    pageTitle: "SHOP ALL",
    showCategoryTiles: true,
    categoryTiles: [...],
    heroSections: [
      { position: 8, type: "icons", ... },
      { position: 16, type: "textWithImages", ... }
    ]
  }
  ```

## Hero Section Types

### Type: "icons"
3 collection images with overlay text and CTA
```typescript
{
  position: 8,
  type: "icons",
  title: "THE ICONS",
  subtitle: "Description...",
  images: [
    { src: "...", title: "DOME COLLECTION", cta: "SHOP THE LOOK" },
    { src: "...", title: "PUZZLE COLLECTION", cta: "SHOP THE LOOK" },
    { src: "...", title: "INTERCONNECTED", cta: "SHOP THE LOOK" }
  ]
}
```

### Type: "textWithImages"
Large text description with 2 images
```typescript
{
  position: 16,
  type: "textWithImages",
  title: "THE PERFECT FIT",
  description: "Long description text...",
  images: [
    { src: "..." },
    { src: "..." }
  ]
}
```

## All Features Included

✅ Infinite scroll with URL pagination
✅ Loading spinner
✅ Back to top floating button
✅ Filter bar (UI ready)
✅ Category tiles (optional)
✅ Hero sections (optional)
✅ SEO description (optional)
✅ More Ways to Shop
✅ Category buttons
✅ Navbar with promo bar
✅ Footer

## API Integration (Future)

Jab API ready ho, sirf `ShopLayout` component mein changes:

```typescript
// Instead of sampleProducts, fetch from API
const fetchProducts = async (category, page) => {
  const res = await fetch(`/api/products?category=${category}&page=${page}`);
  return res.json();
};
```

Sab pages automatically API use karenge! 🚀

## Examples

### Current URLs:
- `/shop-all` - Complex page with hero sections
- `/earrings` - Simple category page
- `/shop` - Old page (untouched, for reference)

### Add More Pages:
Just copy-paste these 3 lines for any new category:

```typescript
import { ShopLayout } from "@/components/ShopLayout";
import { yourConfig } from "@/data/shopConfigs";

export default function YourPage() {
  return <ShopLayout config={yourConfig} />;
}
```

## Benefits

✅ **No Code Duplication** - Ek component, unlimited pages
✅ **Easy Maintenance** - Ek jagah change = sab pages update
✅ **Flexible** - Hero sections add/remove karo easily
✅ **Type Safe** - Full TypeScript support
✅ **Scalable** - API ready structure

Happy coding! 😊
