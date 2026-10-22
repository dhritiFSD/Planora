export const KEY = 'planora.events.v1'
export const uid = () => Math.random().toString(36).slice(2, 9)
export const sum = (a, k) => a.reduce((s, x) => s + (+x[k] || 0), 0)
export const inr = (n) => '₹' + new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(Math.round(n || 0))

const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
export const today = () => iso(new Date())
export const addDays = (s, n) => { const d = new Date(s + 'T00:00:00'); d.setDate(d.getDate() + n); return iso(d) }
export const diffDays = (a, b) => Math.round((new Date(b + 'T00:00:00') - new Date(a + 'T00:00:00')) / 864e5)
export const fmtDate = (s) => new Date(s + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
export const countdown = (s) => {
  const d = diffDays(today(), s)
  return d > 1 ? `${d} days to go` : d === 1 ? 'Tomorrow' : d === 0 ? 'Today' : `${-d} days ago`
}
export const taskPct = (ev) => (ev.tasks.length ? Math.round((ev.tasks.filter((t) => t.done).length / ev.tasks.length) * 100) : 0)

export const VENDOR_CATS = ['Venue', 'Catering', 'Photography', 'Decoration']
export const STATUSES = ['To contact', 'Contacted', 'Quoted', 'Booked']

// tasks / tl entries: [label, days before the event]
export const TYPES = {
  wedding: {
    label: 'Wedding', guests: 250, budget: 1500000,
    split: { Venue: 30, Catering: 30, Decoration: 15, Photography: 10, 'Attire & beauty': 8, Entertainment: 5, Miscellaneous: 2 },
    tasks: [['Set budget and guest list', 120], ['Book the venue', 110], ['Book the photographer', 90], ['Finalise caterer and menu', 75], ['Order invitations', 60], ['Book the decorator', 50], ['Send invitations', 45], ['Plan music and sangeet', 30], ['Confirm final headcount', 10], ['Final vendor walkthrough', 3]],
    tl: [[180, 'Fix date, budget and guest list'], [150, 'Shortlist and visit venues'], [120, 'Book venue and photographer'], [90, 'Finalise caterer, decorator and outfits'], [60, 'Order invitations'], [45, 'Send invitations'], [21, 'Rehearse programme, track RSVPs'], [7, 'Final headcount and vendor confirmations'], [1, 'Set-up day'], [0, 'Wedding day']],
  },
  birthday: {
    label: 'Birthday', guests: 40, budget: 60000,
    split: { Venue: 20, Catering: 35, Decoration: 15, Photography: 8, Entertainment: 12, Miscellaneous: 10 },
    tasks: [['Pick theme and guest list', 30], ['Book venue or plan home setup', 25], ['Order cake', 14], ['Send invitations', 14], ['Book entertainer or DJ', 12], ['Buy decorations and return gifts', 7], ['Confirm RSVPs', 3], ['Pick up cake and set up', 0]],
    tl: [[30, 'Pick theme and guest list'], [21, 'Book venue and entertainer'], [14, 'Send invitations, order cake'], [7, 'Buy decorations and return gifts'], [3, 'Confirm RSVPs'], [1, 'Prepare the space'], [0, 'Birthday celebration']],
  },
  college: {
    label: 'College event', guests: 500, budget: 250000,
    split: { Venue: 15, Catering: 20, Decoration: 10, Photography: 5, Entertainment: 25, Marketing: 15, Miscellaneous: 10 },
    tasks: [['Get faculty and admin approval', 60], ['Form committees and assign leads', 55], ['Secure sponsors', 45], ['Book auditorium or ground', 40], ['Open registrations', 30], ['Book sound and lights', 20], ['Print posters and passes', 14], ['Run volunteer briefing', 3]],
    tl: [[60, 'Approvals and committees'], [45, 'Sponsorship outreach'], [30, 'Registrations and promotion open'], [14, 'Lock schedule and guests'], [7, 'Print passes and posters'], [1, 'Tech check and rehearsal'], [0, 'Event day']],
  },
  community: {
    label: 'Community gathering', guests: 150, budget: 80000,
    split: { Venue: 20, Catering: 40, Decoration: 10, Photography: 5, Entertainment: 10, Miscellaneous: 15 },
    tasks: [['Fix purpose, date and budget', 30], ['Get permissions from society or ward', 25], ['Form volunteer team', 21], ['Book venue or ground', 21], ['Arrange food and water', 10], ['Announce on WhatsApp and notice boards', 10], ['Arrange seating and sound', 4], ['Brief volunteers', 1]],
    tl: [[30, 'Fix purpose, date and budget'], [21, 'Permissions and volunteers'], [14, 'Book venue and caterer'], [7, 'Announce and collect RSVPs'], [2, 'Arrange seating and sound'], [0, 'Gathering day']],
  },
}

export function buildEvent(f) {
  const t = TYPES[f.type]
  return {
    id: uid(), createdAt: Date.now(), ...f, guests: +f.guests, budget: +f.budget,
    expenses: [], ideas: [],
    tasks: t.tasks.map(([title, off]) => ({ id: uid(), title, due: addDays(f.date, -off), done: false })),
    vendors: VENDOR_CATS.map((cat) => ({ id: uid(), cat, name: '', status: 'To contact', quote: 0 })),
  }
}

const ex = (cat, label, amount) => ({ id: uid(), cat, label, amount })
const sv = (e, cat, name, status, quote) => Object.assign(e.vendors.find((v) => v.cat === cat), { name, status, quote })

export function samples() {
  const w = buildEvent({ name: "Aarav & Meera's Wedding", type: 'wedding', date: addDays(today(), 75), guests: 220, city: 'Udaipur', budget: 1800000, notes: 'Traditional ceremony with a sangeet night' })
  w.tasks.forEach((t, i) => (t.done = i < 3))
  w.expenses = [ex('Venue', 'Palace hall advance', 450000), ex('Catering', 'Caterer token amount', 200000), ex('Photography', 'Photographer booking', 60000)]
  sv(w, 'Venue', 'Lake View Palace', 'Booked', 900000); sv(w, 'Catering', 'Shree Rasoi Caterers', 'Quoted', 520000)
  sv(w, 'Photography', 'Frame & Fable Studio', 'Booked', 180000); sv(w, 'Decoration', 'Petal Route Decor', 'Contacted', 0)

  const b = buildEvent({ name: "Kiaan's 5th Birthday", type: 'birthday', date: addDays(today(), 18), guests: 40, city: 'Ahmedabad', budget: 60000, notes: 'Dinosaur theme' })
  b.tasks.forEach((t, i) => (t.done = i < 4))
  b.expenses = [ex('Venue', 'Party hall deposit', 8000), ex('Entertainment', 'Magician show', 6000)]
  sv(b, 'Venue', 'Little Stars Party Hall', 'Booked', 12000); sv(b, 'Catering', 'Tasty Bites', 'Quoted', 20000)

  const c = buildEvent({ name: 'TechNova Fest 2026', type: 'college', date: addDays(today(), 40), guests: 500, city: 'Vadodara', budget: 250000, notes: 'Two-day technical and cultural fest' })
  c.tasks.forEach((t, i) => (t.done = i < 2))
  c.expenses = [ex('Marketing', 'Posters and banners', 18000), ex('Entertainment', 'DJ night advance', 30000)]
  sv(c, 'Venue', 'Main Auditorium', 'Booked', 0)
  return [w, b, c]
}

const POOL = {
  wedding: [
    ['Sunset mandap by the water', 'Hold the ceremony at golden hour with marigold and jasmine drapes.', 'Ceremony'],
    ['Sangeet with a family performance round', 'Let each side of the family prepare one act for {g} guests.', 'Entertainment'],
    ['Regional thali on banana leaf', 'Serve a local menu in {c} so guests taste the place.', 'Food'],
    ['Handwritten welcome notes', 'Leave a short note at each seat; it costs little and feels personal.', 'Personal'],
    ['Live dhol and shehnai baraat', 'Open the day with live music rather than a recorded track.', 'Music'],
    ['Photo wall of both families', 'A printed timeline wall gives guests something to browse and talk about.', 'Decor'],
  ],
  birthday: [
    ['Treasure hunt in the garden', 'Hide clues for {g} guests and finish with the cake.', 'Activity'],
    ['DIY cupcake decorating table', 'Kids decorate their own; it doubles as the return gift.', 'Food'],
    ['Balloon arch in two colours', 'A simple arch makes a strong photo corner at low cost.', 'Decor'],
    ['Storyteller or puppet show', 'A 30-minute show keeps young guests seated and happy.', 'Entertainment'],
    ['Seed-packet return gifts', 'Small plantable gifts are cheap and leave no plastic.', 'Gifts'],
    ['Polaroid corner', 'Print instant photos so every child leaves with a memory.', 'Memories'],
  ],
  college: [
    ['Hackathon and open-mic double bill', 'Run technical events by day and a student open mic by night.', 'Programme'],
    ['Sponsor tier cards', 'Offer bronze, silver and gold packages with clear visibility benefits.', 'Funding'],
    ['QR check-in with free lunch token', 'Cut queues for {g} attendees and track real footfall.', 'Operations'],
    ['Alumni keynote slot', 'Invite an alumnus from {c} to open the event and draw seniors.', 'Speakers'],
    ['Instagram countdown reels', 'Post short daily teasers from the organising team.', 'Marketing'],
    ['Food-truck lane', 'Rent space to local vendors instead of paying for one caterer.', 'Food'],
  ],
  community: [
    ['Potluck with a signature dish board', 'Each family brings a dish and a card with its story.', 'Food'],
    ['Kids and elders games corner', 'Carrom, ludo and skipping rope bring generations together.', 'Activity'],
    ['Local talent stage', 'Invite residents of {c} to sing, recite or demonstrate a skill.', 'Entertainment'],
    ['Seed and plant exchange', 'A simple swap table is free and keeps people mingling.', 'Green'],
    ['Volunteer sash and name tags', 'Make helpers easy to find among {g} attendees.', 'Operations'],
    ['Group photo at the end', 'Print it and display it in the society notice board.', 'Memories'],
  ],
}
const VIBES = {
  Traditional: 'Use brass, marigolds and diyas, and let elders lead one ritual or blessing.',
  Modern: 'Use a tight two-colour palette, clean signage and a single statement backdrop.',
  'Budget-friendly': 'Spend on food and venue first; borrow decor or make it by hand.',
  Luxury: 'Invest in lighting, linens and one live performer; skip many small extras.',
}
export const VIBE_LIST = Object.keys(VIBES)

export function generateIdeas(ev, vibe) {
  const fill = (s) => s.replace('{g}', ev.guests).replace('{c}', ev.city || 'your city')
  const picks = [...POOL[ev.type]].sort(() => Math.random() - 0.5).slice(0, 4)
  const ideas = picks.map(([title, desc, tag]) => ({ id: uid(), title, desc: fill(desc), tag }))
  ideas.push({ id: uid(), title: `${vibe} touch`, desc: VIBES[vibe], tag: 'Style' })
  return ideas
}
