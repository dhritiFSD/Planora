import { useEffect, useState } from 'react'
import { CalendarHeart, Menu, X } from 'lucide-react'
import { KEY, samples } from './lib'
import Landing from './components/Landing'
import CreateEvent from './components/CreateEvent'
import MyEvents from './components/MyEvents'
import EventPage from './components/EventPage'

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw === null) return samples() // first visit: show sample plans
    return JSON.parse(raw) || []
  } catch { return [] }
}

export default function App() {
  const [events, setEvents] = useState(load)
  const [view, setView] = useState({ page: 'home', id: null, preset: null })
  const [open, setOpen] = useState(false)

  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(events)) } catch { /* storage unavailable */ } }, [events])

  const go = (page, id = null, preset = null) => { setView({ page, id, preset }); setOpen(false); window.scrollTo(0, 0) }
  const update = (id, p) => setEvents((es) => es.map((e) => (e.id === id ? { ...e, ...(typeof p === 'function' ? p(e) : p) } : e)))
  const remove = (id) => setEvents((es) => es.filter((e) => e.id !== id))
  const ev = events.find((e) => e.id === view.id)

  const links = [['home', 'Home'], ['events', 'My events']]
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-plum-100 bg-cream/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <button className="flex items-center gap-2 font-display text-xl font-semibold" onClick={() => go('home')}>
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-plum-600 text-white"><CalendarHeart className="h-4 w-4" /></span> Planora AI
          </button>
          <nav className="hidden items-center gap-1 sm:flex">
            {links.map(([k, l]) => <button key={k} onClick={() => go(k)} className={`rounded-full px-4 py-2 text-sm font-medium hover:bg-plum-100 ${view.page === k ? 'bg-plum-100' : ''}`}>{l}</button>)}
            <button className="btn btn-primary btn-sm ml-2" onClick={() => go('create')}>New event</button>
          </nav>
          <button className="rounded-full p-2 hover:bg-plum-100 sm:hidden" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
        </div>
        {open && (
          <nav className="flex flex-col gap-1 border-t border-plum-100 px-4 py-3 sm:hidden">
            {links.map(([k, l]) => <button key={k} onClick={() => go(k)} className="rounded-xl px-3 py-2.5 text-left text-sm font-medium hover:bg-plum-100">{l}</button>)}
            <button className="btn btn-primary mt-1" onClick={() => go('create')}>New event</button>
          </nav>
        )}
      </header>

      <main>
        {view.page === 'home' && <Landing go={go} />}
        {view.page === 'create' && <CreateEvent preset={view.preset} onCreate={(e) => { setEvents((es) => [e, ...es]); go('event', e.id) }} />}
        {view.page === 'event' && ev && <EventPage ev={ev} update={update} remove={remove} go={go} />}
        {(view.page === 'events' || (view.page === 'event' && !ev)) && (
          <MyEvents events={events} go={go} onRemove={remove} onSamples={() => setEvents((es) => [...samples(), ...es])} />
        )}
      </main>

      <footer className="border-t border-plum-100 py-8 text-center text-sm text-plum-700">Planora AI · Plans are saved only in this browser.</footer>
    </div>
  )
}
