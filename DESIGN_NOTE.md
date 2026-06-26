# Design Decisions - LearnIQ Metrics Dashboard

This document details the core design choices and architectural decisions implemented in the LearnIQ People Analytics Dashboard.

## Core UX Decisions

1. **Instant Context Transfer**: Selection of a widget updates the right chat panel instantly. Removing sliding animations ensures a fast, efficient workspace for managers who need to check multiple metrics quickly.
2. **Streaming AI Responses**: Pre-seeded AI openers stream in word-by-word at 32ms per word. This simulates live LLM response generation and guides the manager's attention step-by-step through the core insight card.
3. **Adaptive Visual Focus**: To minimize cognitive load, unselected widgets dim to 45% opacity when a specific metric is active. This focuses the manager's attention on the selected metric and its corresponding chat interface.
4. **Structured Numeric Insights**: AI responses prioritize structured metrics (e.g., bold numbers, localized trend indicators) rather than long paragraphs of prose, making the analytics actionable.
5. **Historical Data Simulation**: Selecting any previous date from the calendar updates all charts, gauges, tables, and counts deterministically. This allows managers to compare historical snapshots side-by-side with live data.

## Front-End Layout & Architecture

1. **Vanilla Core Tech**: Built using standard HTML5, CSS3, and ES6 JavaScript with zero compile or build steps. This keeps the application load time fast, lightweight, and easy to review.
2. **Neutral Dark Theme**: The dark mode is styled with a neutral charcoal color palette (zero blue tint) to maximize contrast, minimize eye strain, and fit a professional enterprise workspace.
3. **Robust Grid Stability**: Columns use `minmax(0, 1fr)` and parent containers use `flex-shrink: 0` to prevent inner elements (Chart.js canvas, tables, progress indicators) from stretching, overflowing, or overlapping on small viewports.
4. **Accessible Navigation**: The dashboard supports full keyboard navigation (arrow keys to cycle widgets, Escape to clear context, and clickable date targets).
