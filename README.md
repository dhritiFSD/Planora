# Planora AI – Smart Event Planner

React + Vite + Tailwind CSS + Lucide React. No backend; plans are saved in `localStorage`.

## Run
```bash
cd Planora-AI
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

## Structure
- `src/lib.js` – event templates, sample data, date/₹ helpers, demo idea generator
- `src/components/` – Landing, CreateEvent, MyEvents, EventPage, Tabs (Ideas, Budget, Tasks, Timeline, Vendors), ui
- To add real AI later, replace `generateIdeas()` in `src/lib.js` with a call to your own backend (never put an API key in frontend code).
