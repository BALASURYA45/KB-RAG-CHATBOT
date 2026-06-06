export function SupportHomePage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 py-8">
        <header className="border-b border-slate-200 pb-6">
          <p className="text-sm font-medium uppercase tracking-wide text-teal-700">
            Level-0 Support
          </p>
          <h1 className="mt-2 text-3xl font-semibold">KB Support Assistant</h1>
        </header>

        <div className="grid flex-1 place-items-center py-10">
          <div className="w-full max-w-2xl rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Chat module coming next</p>
            <p className="mt-3 text-lg text-slate-800">
              The app shell is ready. Next we will connect the knowledge base,
              retrieval, and chat flow module by module.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
