# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with hot reload
- `npm run build` - Create production build 
- `npm run preview` - Preview production build locally

## Project Overview

This is a Japanese household accounting (kakeibo) web application built for a hackathon frontend. It's a single-page React application that helps users track income and expenses with a calendar interface.

## Architecture

- **Framework**: React 18 with Vite for build tooling
- **Main Component**: Single `App.jsx` component managing all application state
- **Calendar**: Uses `react-calendar` library with custom CSS styling
- **State Management**: Local React state (no external state management)
- **Styling**: Inline styles with custom CSS for calendar components

## Key Components

- `src/App.jsx` - Main application component containing:
  - Financial record management (income/expense tracking)
  - Calendar interface with date selection
  - Form for adding new records
  - Summary table and total calculation
- `src/CustomCalendar.css` - Custom styling for react-calendar component
- `src/main.jsx` - Application entry point

## Data Structure

Records are stored as objects with:
- `type`: "収入" (income) or "支出" (expense)
- `amount`: Number value
- `memo`: Text description
- `date`: Date object
- `id`: Timestamp-based unique identifier

## UI Features

- Calendar shows daily totals and highlights dates with records
- Japanese locale formatting for currency (¥) and dates
- Form validation for numeric amounts
- Real-time total calculation display