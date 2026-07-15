"use client";

import { useApp } from "@/lib/context/AppProvider";

export function StateLawPanel() {
  const { getStateLaw } = useApp();
  const law = getStateLaw();

  if (!law) return null;

  return (
    <div id="state-law-panel" style={{ display: "block", marginBottom: "1.5rem" }}>
      <div className="sec-label" id="state-law-title">
        {law.name} — specific laws
      </div>
      <div className="card" id="state-law-content">
        <div className="rights-list">
          <div className="law-stat">
            <div className="law-key">Deposit return deadline</div>
            <div className="law-val">{law.depositDays}</div>
          </div>
          <div className="law-stat">
            <div className="law-key">Wrongful withholding penalty</div>
            <div className="law-val">{law.depositMultiplier} the deposit amount</div>
          </div>
          <div className="law-stat">
            <div className="law-key">Required entry notice</div>
            <div className="law-val">{law.noticeDays}</div>
          </div>
          <div className="law-stat">
            <div className="law-key">Eviction notice periods</div>
            <div className="law-val">{law.evictionNotice}</div>
          </div>
          <div className="law-stat">
            <div className="law-key">Rent control</div>
            <div className="law-val">
              {law.rentControl ? (
                <span className="law-badge badge-good">Yes — protections exist</span>
              ) : (
                <span className="law-badge badge-none">No statewide control</span>
              )}
              <br />
              <span
                style={{
                  fontSize: 12,
                  color: "var(--text-3)",
                  fontWeight: 400,
                  marginTop: 3,
                  display: "block",
                }}
              >
                {law.rcNote}
              </span>
            </div>
          </div>
          {law.extra ? (
            <div className="law-stat">
              <div className="law-key">Notable protections</div>
              <div className="law-val">{law.extra}</div>
            </div>
          ) : null}
          <div className="law-stat">
            <div className="law-key">Free legal aid</div>
            <div className="law-val">
              <a
                href={law.legalAid}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--blue)" }}
              >
                {law.legalAid.replace("https://", "")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
