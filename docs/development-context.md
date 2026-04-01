# Development Context

Update this file on every meaningful development turn.

## Workspace

- Root: `D:\yingzi`
- API: `apps/api`
- Admin web: `apps/admin-web`
- Mobile H5: `apps/mobile-h5`

## Current Local Ports

- API: `3002`
- Admin web: `3200`
- Mobile H5: `3300`

## Current Product Scope

### API

- Health endpoint and API root info page
- JWT login and current-user endpoint
- Protected admin routes for overview, users, merchants, products, orders and system config
- Public storefront routes for mobile H5 home, merchants and products
- Storefront now supports merchant detail and product detail endpoints
- Merchant module now supports list, detail, create, edit, status change and delete
- Product module now supports list, detail, create, edit, status change and delete
- Banner and promotion modules now support list, detail, create, edit and delete
- Consumer cart API is now available with list, add item, update item, remove item and clear cart
- Order module now supports list, detail, consumer order creation and status update

### Admin Web

- Login page with demo accounts
- Left-navigation admin layout
- Dashboard with overview metrics
- Product management view with publish form and status switch
- Detailed management entries for merchant, banner, promotion, order, user and settings

### Mobile H5

- Bottom navigation with five tabs: home, discover, cart, orders, profile
- Home page with banners, quick entries, recommended merchants and products
- Discover page with merchant directory and product feed
- Product detail page and merchant detail page are now clickable from home, discover, cart and orders
- Cart, orders and profile are split into separate view components and support click-through navigation
- Mobile frontend is now componentized into `components`, `features/views`, `lib` and `types`

### Current Round Notes

- Fixed the mobile H5 Chinese UI text and removed corrupted strings from the new clickable flows
- Added stack-based navigation for merchant detail and product detail so back navigation returns to the previous screen
- Rebuilt the admin web `App.tsx` into a stable left-navigation Chinese management shell with working dashboard, merchant, product, banner, promotion, order, user and settings views
- Removed stray compiled `.js/.map` files from frontend `src` directories to keep the codebase maintainable
- Reworked API seed data into cleaner merchant, product and order structures with description, address, business hours and order items
- Added consumer demo account `13900000004 / User@123` for cart and order testing
- Verified API login, storefront product detail, storefront merchant detail, cart write/read and order creation with live requests on a temporary local port

## Deployment

- Preferred panel workflow: BaoTa
- API should run as a Node service via PM2
- `admin-web` and `mobile-h5` should be deployed as static Nginx sites
- BaoTa deployment doc: [baota-deploy.md](/D:/yingzi/docs/baota-deploy.md)

## Important Notes

- Keep mobile UI compact and navigation-first. Avoid prototype-style long stacked cards without persistent navigation.
- The mobile app currently uses public storefront endpoints and does not require login yet.
- Some earlier files had encoding-corrupted Chinese strings. Prefer ASCII-safe content unless the file encoding is confirmed clean.
- Chinese UI text is now written with Unicode-safe literals in key mobile and storefront files to reduce encoding corruption risk.

## Next Recommended Steps

1. Implement real cart and order APIs in the backend.
2. Add mobile login, register and personal-center persistence.
3. Persist merchant, product, banner, promotion, cart and order data to a database instead of in-memory arrays.
4. Continue componentizing the admin web into `layouts`, `features` and shared form/list components.
5. Add file upload for product images and merchant gallery images.

## Detailed Mall Plan

### Phase 1: Media and Presentation

- Add product image upload and gallery fields
- Add merchant cover image and store gallery fields
- Keep the mobile top search bar sticky for browsing flow
- Replace placeholder cards with image-based merchant and product cards

### Phase 2: Merchant and Product Management

- Merchant CRUD and merchant detail pages
- Product category management
- Product detail, edit, delete and batch status update
- Inventory and stock warning management

### Phase 3: Marketing and Activity

- Banner management
- Promotion activity management
- Coupon configuration and issuance
- Store recommendation and featured products

### Phase 4: Real Transaction Flow

- Cart API and cart page
- Order creation and order center
- Address management
- Payment preparation and after-sale flow

### Phase 5: User System

- SMS or password login
- Personal center
- Coupons, points and favorites
- Customer service and feedback
