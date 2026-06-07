import { ChatWindow } from "../components/ChatWindow";

export function SupportHomePage() {
  return (
    <main className="min-h-screen bg-slate-100 text-slate-950">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-5 sm:px-6 lg:px-8">
        <ChatWindow />
      </section>
    </main>
  );
}
