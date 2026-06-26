# LearnIQ - Analytics Dashboard

LearnIQ is a high-fidelity, manager-facing learning analytics dashboard designed to monitor and optimize organizational learning performance. It combines a structured metrics overview with a simulated widget-to-chat AI interaction to allow learning managers to dive deep into key metrics.

## Key Features

1. **Learning Overview Widgets**: Tracks four core people learning metrics:
   - **Course Completion Rate**: Monthly performance with department-level progress tracking.
   - **Weekly Active Learners**: Weekly adoption trends with team-by-team engagement statistics.
   - **Skill Gap Index**: Organizational skill gaps (Data Literacy, Cloud Infrastructure, Leadership) with industry benchmarks.
   - **At-Risk Employees**: Real-time list of inactive users needing manager outreach.
2. **Interactive Widget-to-Chat AI**: Select any metric card to open a contextualized chat. The simulated AI guides managers through deeper analytics, outlines risk areas, and suggests direct action plans (e.g., manager nudges, localized certifications).
3. **Simulated Historical Date Picker**: An interactive calendar chip in the header allows users to travel back in time, rendering complete historical snapshots (trends, progress lists, tables, and counts) to compare past performance.
4. **Header Components**: A responsive notification center (bell menu) to review real-time alerts, and a user profile menu.
5. **Settings Panel**: Side-drawer control panel supporting:
   - **Dark Mode**: Switch to a neutral charcoal dark theme.
   - **Compact Mode**: Reduces widget padding to show more information in compact viewports.

## Technical Architecture

The project is built with a lightweight, dependency-free architecture focused on speed and clean code:
- **Backend**: Node.js and Express to serve static frontend files.
- **Frontend**: Vanilla HTML5, Vanilla CSS3 (utilizing modern custom property tokens), and Vanilla ES6 JavaScript.
- **Data Visualization**: Chart.js (loaded via CDN) to render responsive gauges and bar charts.

## File Structure

- `/public`
  - `index.html`: Main dashboard markup, layouts, and modals.
  - `style.css`: Clean, token-based stylesheet containing both light and dark theme overrides.
  - `app.js`: All client-side reactivity, chart initializations, simulated AI context flow, and historical calculations.
- `server.js`: Standard Express static resource server.
- `package.json`: Dependency manifests and dev scripts.

## Installation & Setup

Ensure you have Node.js installed on your machine.

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Sumanth2377/metrics-dashboard.git
   cd metrics-dashboard
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Access the application**:
   Open your browser and navigate to `http://localhost:3000`.
