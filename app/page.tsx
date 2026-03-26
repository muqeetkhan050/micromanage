import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 font-sans">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-zinc-200 dark:border-zinc-800">
        <h1 className="text-xl font-bold">Micromanage</h1>
        <div className="flex gap-4">
          <Link href="/login" className="px-4 py-2 rounded-md bg-zinc-900 text-white dark:bg-white dark:text-black font-medium hover:opacity-90">
            Login
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center text-center py-24 px-4">
        <h2 className="text-5xl font-bold max-w-2xl leading-tight">
          Manage your team, track issues, stay in sync.
        </h2>
        <p className="mt-4 text-lg text-zinc-500 max-w-lg">
          Micromanage helps small teams raise issues, assign tasks, track time, and chat — all in one place.
        </p>
        <Link href="/login" className="mt-8 px-6 py-3 rounded-md bg-zinc-900 text-white dark:bg-white dark:text-black font-medium text-lg hover:opacity-90">
          Get Started
        </Link>
      </section>

      {/* How it works */}
      <section className="py-16 px-8 bg-white dark:bg-zinc-900">
        <h3 className="text-3xl font-bold text-center mb-12">How it works</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="p-6 rounded-lg border border-zinc-200 dark:border-zinc-700">
            <h4 className="text-xl font-semibold mb-2">1. Create an Org</h4>
            <p className="text-zinc-500">Sign up and create your organisation. Invite your team members to join.</p>
          </div>
          <div className="p-6 rounded-lg border border-zinc-200 dark:border-zinc-700">
            <h4 className="text-xl font-semibold mb-2">2. Raise Issues</h4>
            <p className="text-zinc-500">Create and assign issues to team members. Track progress with status updates.</p>
          </div>
          <div className="p-6 rounded-lg border border-zinc-200 dark:border-zinc-700">
            <h4 className="text-xl font-semibold mb-2">3. Collaborate</h4>
            <p className="text-zinc-500">Chat in real-time, clock in/out, and get weekly email summaries.</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-8">
        <h3 className="text-3xl font-bold text-center mb-12">Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {[
            { title: 'Issue Tracking', desc: 'Raise, assign, and track issues with status updates.' },
            { title: 'Real-time Chat', desc: 'Communicate with your team instantly via org chat.' },
            { title: 'Time Tracking', desc: 'Clock in and out to track working hours.' },
            { title: 'Weekly Newsletters', desc: 'Get automated weekly summaries of your team activity.' },
            { title: 'Role Management', desc: 'Manage who can do what within your organisation.' },
            { title: 'Profile & Dashboard', desc: 'See your assigned issues, org info, and stats at a glance.' },
          ].map((f) => (
            <div key={f.title} className="p-5 rounded-lg border border-zinc-200 dark:border-zinc-700">
              <h4 className="font-semibold mb-1">{f.title}</h4>
              <p className="text-sm text-zinc-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-8 bg-white dark:bg-zinc-900">
        <h3 className="text-3xl font-bold text-center mb-12">FAQs</h3>
        <div className="max-w-2xl mx-auto space-y-6">
          {[
            { q: 'Is Micromanage free?', a: 'Yes, Micromanage is completely free for small teams.' },
            { q: 'How do I invite team members?', a: 'Share your organisation name — they can join by searching for it during signup.' },
            { q: 'Can I track time?', a: 'Yes. Each user can clock in and out, and hours are tracked per day.' },
            { q: 'Is there real-time chat?', a: 'Yes, every organisation gets a live chat powered by Socket.IO.' },
          ].map((faq) => (
            <div key={faq.q} className="border-b border-zinc-200 dark:border-zinc-700 pb-4">
              <h4 className="font-semibold">{faq.q}</h4>
              <p className="text-sm text-zinc-500 mt-1">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-zinc-400 border-t border-zinc-200 dark:border-zinc-800">
        Micromanage &copy; {new Date().getFullYear()}
      </footer>
    </div>
  )
}
