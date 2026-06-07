import { ChatWindow } from "../components/ChatWindow";

export function SupportHomePage() {
  return (
    <main className="min-h-screen bg-[#eef3f7] text-slate-950">
      <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-3 py-3 sm:px-5 sm:py-5 lg:px-8">
        <ChatWindow />
      </section>
    </main>
  );
}
