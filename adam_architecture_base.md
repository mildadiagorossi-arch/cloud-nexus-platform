# Adam Architecture Base – Summary of Modifications

## Backend (NestJS)
- **AppModule** (`backend/src/app.module.ts`): imports `MarketplaceModule`.
- **Main entry** (`backend/src/main.ts`): bootstrap NestFactory, enable CORS, listen on port 3000.
- **MarketplaceModule** (`backend/src/interfaces/http/modules/MarketplaceModule.ts`):
  - Registers `StorefrontController`, `GetStorefrontUseCase`.
  - Provides `PrismaClient` instance.
  - DI tokens `'VendorRepository'` → `PrismaVendorRepository`.
  - DI tokens `'SocialMediaPort'` → `SocialMediaAdapter`.
- **UseCase** (`backend/src/application/use-cases/vendor/GetStorefrontUseCase.ts`):
  - Uses `@Inject` with string tokens.
  - Retrieves vendor via repository and social feed via port.
- **Repository** (`backend/src/infrastructure/persistence/PrismaVendorRepository.ts`):
  - SQLite‑compatible handling of `themeJson` stored as string.
  - Runtime validation of theme.
- **Controller** (`backend/src/interfaces/http/controllers/StorefrontController.ts`):
  - `GET /store/:slug` returns storefront data.
- **Prisma schema** (`backend/src/infrastructure/persistence/prisma/marketplace.prisma`):
  - Added generator and datasource (SQLite).
  - `Vendor` model with `id`, `name`, `storeSlug`, `themeJson`.
- **Seed script** (`backend/src/seed.ts`): creates a demo vendor (`nike-official`).
- **Backend package.json** (`backend/package.json`): forces CommonJS for NestJS.

## Frontend (React / Vite)
- **Dynamic route** added in `src/App.tsx`: `<Route path="/store/:slug" element={<Storefront />} />`.
- **Storefront page** (`src/pages/Storefront.tsx`):
  - Uses `useParams` to fetch vendor from mock DB.
  - Renders `StoreHeader`, `SocialGrid`, product catalogue.
- **StoreHeader component** (`src/components/storefront/StoreHeader.tsx`):
  - Displays banner, logo, vendor name, description, rating, follow/share buttons.
- **SocialGrid component** (`src/components/storefront/SocialGrid.tsx`):
  - Grid of Instagram/TikTok posts with hover effects.
- **Mock data** inside `Storefront.tsx` provides vendor info, products, and social posts.
- **Navbar & Footer** reused for consistent layout.

## Miscellaneous
- Added required dependencies (`@nestjs/*`, `@prisma/client`, `reflect-metadata`, `rxjs`).
- Installed dev tools (`prisma`, `ts-node`).
- Adjusted import paths for correct relative locations.
- Ensured TypeScript compilation via `backend/tsconfig.json`.
- Ran `prisma generate` and `prisma db push` to create `dev.db`.

---
*All changes are committed and pushed to the repository. The backend runs on `http://localhost:3000` and the frontend on `http://localhost:5173`. The Storefront page is reachable at `/store/nike-official`.*
