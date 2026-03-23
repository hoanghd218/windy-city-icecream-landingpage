# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Windy City Ice Cream landing page — a multi-page marketing site built with Next.js 16 (App Router) using JSX (not TypeScript).

## Commands

- **Dev server:** `pnpm dev`
- **Build:** `pnpm build`
- **Lint:** `pnpm lint` (ESLint flat config)
- **Package manager:** pnpm (lockfile is `pnpm-lock.yaml`)

## Architecture

- **Next.js App Router** with all pages as client components (`"use client"`) — no server components or API routes
- **Styling:** Tailwind CSS v4 (imported via `@import "tailwindcss"` in `globals.css`) plus custom CSS classes. Two fonts: Architects Daughter (headings/display) and Archivo (body)
- **Animations:** GSAP with ScrollTrigger plugin. Every page registers ScrollTrigger and uses refs + `useEffect` for entrance/scroll animations
- **Smooth scrolling:** Lenis (`@studio-freight/lenis`)
- **CSS variables:** `--primary-heading` (#00334E) and `--secound-heading` (#CE598C) defined in `globals.css`

## Key Patterns

- Pages live in `src/app/<route>/page.jsx` (about, contact, events, pricing, refunds, service)
- Shared layout components: `src/components/Header.jsx` and `src/components/Footer.jsx` — imported per-page, not in the root layout
- Images are served from `/public` and referenced with `next/image` using root-relative paths (e.g., `"/1211991 2.png"`)
- The root layout (`src/app/layout.jsx`) is minimal — only sets `overflow-x-hidden` on body
