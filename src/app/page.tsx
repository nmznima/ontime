import Link from "next/link";

export default function Home() {
  
  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl text-center">
        <header className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Simple Count-Up Timer</h1>
          <p className="text-sm text-slate-500 mt-1">Enter an activity title, start the timer, then pause/resume or finish to log it.</p>
        </header>

        <button>
          <Link href='/login' className="flex bg-slate-800 hover:bg-slate-600 py-2 px-6 text-white rounded-lg">
            Start
          </Link>
        </button>

      </div>
    </div>
  );
}