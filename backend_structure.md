
# meLivro.me Architecture & Deployment

## 1. Folder Structure
```
/meLivro.me
├── app/
│   ├── Controllers/      # Route handling logic
│   ├── Models/           # Database interactions (PDO)
│   ├── Services/         # Affiliate logic, SEO, Gemini Integration
│   ├── Middleware/       # Auth checking, CSRF, Security headers
│   └── Views/            # PHP partials/templates
├── config/
│   ├── database.php      # PDO instance
│   └── config.php        # App settings (.env wrapper)
├── core/
│   ├── Router.php        # Micro-router logic
│   └── App.php           # Main container
├── public/
│   ├── assets/           # CSS (Tailwind), JS, Images
│   ├── index.php         # Entry point
│   ├── .htaccess         # Rewrite rules for clean URLs
│   ├── manifest.json     # PWA
│   └── sw.js             # Service Worker
├── storage/              # Logs, Cache (ensure write permissions)
├── .env                  # Secrets (DO NOT COMMIT)
└── composer.json
```

## 2. Deployment Checklist
- [ ] **Server**: PHP 8.2+ with `pdo_mysql`, `mbstring`, `openssl`, `json`.
- [ ] **SSL**: Ensure Let's Encrypt / HTTPS is active.
- [ ] **Environment**: Set `APP_ENV=production` and `AMAZON_AFFILIATE_TAG`.
- [ ] **Permissions**: `chmod -R 775 storage/`.
- [ ] **Rewrite**: Verify `mod_rewrite` is enabled on Apache for clean URLs.
- [ ] **Security Headers**: Verify `Content-Security-Policy` and `X-Frame-Options` in `.htaccess` or Middleware.
- [ ] **Database**: Run `schema.sql` and create a dedicated user with minimal privileges.
- [ ] **Sitemap**: Set up a cron job to regenerate `sitemap.xml` daily.
```
