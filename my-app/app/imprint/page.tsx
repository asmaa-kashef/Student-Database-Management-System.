import Link from 'next/link';

export default function ImprintPage() {
  return (
    <div className="bg-[#0b0f17] text-slate-200 font-sans min-h-screen p-6 md:p-12 flex flex-col justify-between antialiased selection:bg-sky-500 selection:text-white">
      
      <div className="max-w-3xl mx-auto w-full space-y-6">
        
        {/* Header */}
        <header className="flex items-center justify-between border-b border-[#212d40] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-400/30 flex items-center justify-center text-sky-400">
              🎓
            </div>
            <div>
              <h2 className="font-bold text-sm tracking-wider text-slate-100 uppercase">AIMAP</h2>
              <span className="text-[10px] text-slate-400 font-medium">Academic Information and Management Platform</span>
            </div>
          </div>
          <Link href="/" className="bg-sky-500 hover:bg-sky-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-all">
            &larr; Back to Dashboard
          </Link>
        </header>

        {/* Main Card Content */}
        <main className="bg-[#161e2e] border border-[#212d40] rounded-xl p-6 md:p-8 space-y-6 shadow-xl">
          <h1 className="text-xl font-bold text-white border-b border-[#212d40] pb-3">Imprint & Legal Notice</h1>
          
          {/* Contact Information */}
          <section className="space-y-2 text-xs text-slate-300">
            <h2 className="text-sm font-bold text-sky-400 uppercase tracking-wider">Contact Information</h2>
            <p><strong className="text-slate-100">AIMAP Project Team</strong></p>
            <p>Constructor University Bremen</p>
            <p>Campus Ring 1, 28759 Bremen, Germany</p>
            <p>Contact: <code className="bg-[#0b0f17] px-2 py-0.5 rounded text-sky-300 border border-[#212d40]">student-team [at] constructor.university</code></p>
          </section>

          <hr className="border-[#212d40]" />

          {/* Mandatory Legal Disclaimer */}
          <section className="space-y-3 text-xs text-slate-300 leading-relaxed bg-[#0b0f17]/50 p-4 rounded-lg border border-[#212d40]">
            <h2 className="text-sm font-bold text-rose-300 uppercase tracking-wider">Mandatory Legal Disclaimer</h2>
            <p className="italic">
              This website is student lab work and does not necessarily reflect Constructor University opinions.
              Constructor University does not endorse this site, nor is it checked by Constructor University
              regularly, nor is it part of the official Constructor University web presence.
            </p>
            <p className="italic">
              For each external link existing on this website, we initially have checked that the target page
              does not contain contents which is illegal wrt. German jurisdiction. However, as we have no
              influence on such contents, this may change without our notice. Therefore we deny any responsibility
              for the websites referenced through our external links from here.
            </p>
            <p className="font-semibold text-emerald-400 pt-1">
              ✓ No information conflicting with GDPR is stored in the server.
            </p>
          </section>
        </main>

      </div>

      {/* Footer */}
      <footer className="text-center text-[11px] text-slate-500 pt-8 border-t border-[#212d40] mt-12">
        <p>&copy; 2026 AIMAP Academic Platform &bull; Constructor University Data Management & Database Project</p>
      </footer>

    </div>
  );
}