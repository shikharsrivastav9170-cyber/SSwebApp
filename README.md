# SSWebStudio CRM

This repository will contain the Next.js PWA application for the SSWebStudio Sales CRM + Employee Tracking app.

## Getting Started

1. Ensure Node.js (>=18.x) and npm are installed on your machine.
2. In your project folder run:
   ```bash
   npx create-next-app@latest . --typescript --eslint --tailwind --src-dir --app --use-npm
   ```
3. Follow the prompts to complete setup.
4. Install Supabase client and configure environment variables:
   ```bash
   npm install @supabase/supabase-js
   ```
5. Create a `.env.local` file with Supabase keys and any other secrets.

## GitHub Deployment

1. Initialize git and commit initial files:
   ```bash
   git init
   git add .
   git commit -m "Initial scaffold and layout"
   ```
2. Create a new repository on GitHub (e.g., `SSwebStudio-crm`).
3. Add the remote and push:
   ```bash
   git remote add origin https://github.com/<your-username>/SSwebStudio-crm.git
   git branch -M main
   git push -u origin main
   ```
4. Set up GitHub Actions (optional) and configure environment variables for Vercel.

## Schema

The file `supabase-schema.sql` contains initial DDL for tables and basic RLS policies; run it in your Supabase SQL editor to create the schema.

## Features so far

- Basic Next.js project with Tailwind
- Header and sidebar components
- Login page placeholder
- Dashboard skeleton with layout
- Supabase client helper

Continue building authentication, lead management, and analytics as per the one-page prompt.
## Deployment to Vercel

1. Sign in to [Vercel](https://vercel.com) and import the GitHub repo.
2. Configure project settings, supply environment variables from Supabase.
3. The build command will be `npm run build` and the output directory is `.next`.

---

Refer back to the initial one-page prompt for full feature requirements and database schema guidelines.