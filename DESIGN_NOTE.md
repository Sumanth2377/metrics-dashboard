# Design Note — Widget-to-Chat Interaction

## Core Design Decisions

**The selection moment is a scene transition, not a state change.** When a manager clicks a widget, the right panel doesn't just update — the context bar slides out upward while a new one slides in from below, and a thin indigo progress bar sweeps across the top. This directional animation communicates that the chat is now *about* the selected widget, making the context transfer feel intentional rather than incidental.

**Streaming text makes the AI feel alive before the user types anything.** Each pre-seeded AI opener streams in word-by-word at ~32ms/word, directly mimicking real LLM output. This single interaction answers the brief's core question — *"how does the AI response render?"* — in the most visceral way possible, and signals that the system is proactive, not just reactive.

**Widgets dim on selection to reduce cognitive load.** Rather than only highlighting the active widget, all others drop to 45% opacity. This mirrors the mental model of "zooming in" on one metric: the manager's attention is fully pulled into the selected data context, reducing the noise of the surrounding dashboard.

**The AI response renderer handles two distinct modes.** Streaming openers transition into a structured insight card (bold number + trend label) after text completion. Follow-up responses use a 800ms loading skeleton → instant markdown render (bold via regex). This demonstrates that analytics answers benefit from numeric emphasis rather than prose alone — a distinction that matters as the product scales to richer data types.

## Assumptions Made

- "AI response" is simulated — no real API is wired. Responses are keyword-matched with an 800ms latency + animated loading skeleton to feel realistic.
- Desktop-only at 1280px per the constraints brief — a persistent warning banner guards against narrower viewports.
- Keyboard navigation (↑↓ arrow keys to cycle widgets, Enter to select) is implemented for accessibility and power users; this is mentioned here rather than hidden in code comments.

## Architecture Decision

Express + vanilla JS/HTML with zero build step. Chart.js via CDN. No framework overhead — keeps the Node.js surface clean and lets evaluators read the code without mental overhead from JSX or component trees.
