"use client";

export function Footer() {
  return (
    <footer className="mt-auto">
      {/* Gold delimitation rule */}
      <div aria-hidden="true" className="border-t-2 border-gold" />
      <div aria-hidden="true" className="mb-0 border-t border-gold/25" />

      <div className="bg-navy text-[#B9C4D2]">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 md:grid-cols-3 md:gap-8">
          {/* Authority */}
          <div>
            <p className="text-[9.5px] font-semibold uppercase tracking-[0.28em] text-gold-bright">
              Authority
            </p>
            <p className="mt-3 font-serif text-base font-semibold leading-snug text-[#F2EFE7]">
              South Africa–Türkiye Sovereign AI &amp; Digital Trade Sandbox
            </p>
            <p className="mt-3 text-xs leading-relaxed text-[#93A3B8]">
              Prepared by Business Hustle — Simple Eternity Holdings (Pty) Ltd
              for the Directorate of Communications (Presidency of Türkiye) and
              the Embassy of the Republic of Türkiye, following the STRATCOM
              Roundtable, Johannesburg.
            </p>
          </div>

          {/* Programme */}
          <div>
            <p className="text-[9.5px] font-semibold uppercase tracking-[0.28em] text-gold-bright">
              Programme Facilities
            </p>
            <ul className="mt-3 space-y-2 text-xs leading-relaxed">
              <li className="border-l border-[#243B57] pl-3">
                <span className="font-semibold text-[#D3DBE5]">I — Diplomatic Knowledge Hub</span>
                <span className="block text-[#7E8FA3]">Policy intelligence &amp; commitment tracking</span>
              </li>
              <li className="border-l border-[#243B57] pl-3">
                <span className="font-semibold text-[#D3DBE5]">II — Information Integrity Engine</span>
                <span className="block text-[#7E8FA3]">SHA-256 · Ed25519 bulletin verification</span>
              </li>
              <li className="border-l border-[#243B57] pl-3">
                <span className="font-semibold text-[#D3DBE5]">III — Cross-Border Trade Engine</span>
                <span className="block text-[#7E8FA3]">SMME matchmaker under AfCFTA guidelines</span>
              </li>
              <li className="border-l border-[#243B57] pl-3">
                <span className="font-semibold text-[#D3DBE5]">IV — Live Demonstration Console</span>
                <span className="block text-[#7E8FA3]">Five-scene protocol · privileged command terminal</span>
              </li>
              <li className="border-l border-[#243B57] pl-3">
                <span className="font-semibold text-[#D3DBE5]">V — Production Pathway</span>
                <span className="block text-[#7E8FA3]">System architecture · security · CI/CD · recovery</span>
              </li>
            </ul>
          </div>

          {/* Notice */}
          <div>
            <p className="text-[9.5px] font-semibold uppercase tracking-[0.28em] text-gold-bright">
              Notice
            </p>
            <p className="mt-3 text-xs leading-relaxed text-[#93A3B8]">
              Demonstration sandbox. Company registries are illustrative;
              bulletins are sealed with the sandbox demo keypair and remain
              independently verifiable. Policy analysis output is
              machine-generated and requires official review before use.
            </p>
            <p className="mt-3 text-xs leading-relaxed text-[#93A3B8]">
              Verification is stateless by design — no reliance on this server
              is required to confirm authenticity. Every console and protocol
              action is recorded in the operations ledger for official review.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-navy-line">
          <div className="mx-auto flex max-w-6xl flex-col gap-1.5 px-4 py-3.5 text-[10px] font-medium uppercase tracking-[0.18em] text-[#7E8FA3] sm:flex-row sm:items-center sm:justify-between">
            <p>
              © MMXXVI Simple Eternity Holdings (Pty) Ltd · Phase I · Approved 14 September 2026
            </p>
            <p>Pretoria · Johannesburg · Ankara · Istanbul</p>
          </div>
        </div>
        <div className="pb-[max(0.5rem,env(safe-area-inset-bottom))]" />
      </div>
    </footer>
  );
}
