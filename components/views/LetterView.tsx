"use client";

import { useEffect, useRef, useState } from "react";
import { LETTER_PLACEHOLDERS } from "@/lib/data/constants";
import { TEMPLATES } from "@/lib/data/letter-templates";
import { useApp } from "@/lib/context/AppProvider";
import type { LetterType } from "@/types";

export function LetterView() {
  const {
    getStateLaw,
    letterTypePrefill,
    setLetterTypePrefill,
    tryUseLetter,
    incrementLetterUsage,
    showToast,
  } = useApp();

  const [tenant, setTenant] = useState("");
  const [landlord, setLandlord] = useState("");
  const [address, setAddress] = useState("");
  const [landlordAddress, setLandlordAddress] = useState("");
  const [date, setDate] = useState("");
  const [letterType, setLetterType] = useState<LetterType>("repairs");
  const [details, setDetails] = useState("");
  const [letterText, setLetterText] = useState("");
  const [showResult, setShowResult] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDate(
      new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    );
  }, []);

  useEffect(() => {
    if (letterTypePrefill) {
      setLetterType(letterTypePrefill as LetterType);
      setLetterTypePrefill(null);
    }
  }, [letterTypePrefill, setLetterTypePrefill]);

  const generateLetter = () => {
    if (!tryUseLetter()) return;
    incrementLetterUsage();

    const n = tenant || "[Your Name]";
    const l = landlord || "[Landlord Name]";
    const la = landlordAddress || "[Landlord Address]";
    const a = address || "[Your Address]";
    const d =
      date ||
      new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    const law = getStateLaw();
    const tmpl = TEMPLATES[letterType];
    if (!tmpl) return;

    const text = tmpl(n, l, la, a, d, details, law);
    setLetterText(text);
    setShowResult(true);
    window.setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const copyLetter = () => {
    navigator.clipboard
      .writeText(letterText)
      .then(() => showToast("Letter copied to clipboard"))
      .catch(() => {});
  };

  const printLetter = () => {
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(
      `<html><head><title>Renter Demand Letter</title><style>body{font-family:Georgia,serif;font-size:14px;line-height:1.8;padding:2in 1.5in;white-space:pre-wrap}</style></head><body>${letterText}</body></html>`
    );
    w.document.close();
    w.print();
  };

  return (
    <>
      <div className="page-header">
        <div className="page-eyebrow">Draft a letter</div>
        <h1 className="page-title">Create a formal demand letter</h1>
        <p className="page-sub">
          Fill in the fields below. Your letter will be ready to copy, print, or email — and will include
          state-specific legal language if you&apos;ve selected your state.
        </p>
      </div>

      <div className="callout callout-amber">
        <svg viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <div>
          Always send demand letters via certified mail or email with read receipt. Keep a copy of
          everything you send.
        </div>
      </div>

      <div className="card">
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label" htmlFor="l-tenant">
              Your full name
            </label>
            <input
              className="form-input"
              id="l-tenant"
              type="text"
              placeholder="Jane Smith"
              value={tenant}
              onChange={(e) => setTenant(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="l-landlord">
              Landlord / property manager name
            </label>
            <input
              className="form-input"
              id="l-landlord"
              type="text"
              placeholder="John Doe or ABC Properties LLC"
              value={landlord}
              onChange={(e) => setLandlord(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="l-address">
              Your rental address
            </label>
            <input
              className="form-input"
              id="l-address"
              type="text"
              placeholder="123 Main St, Apt 4, City, State"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="l-landlord-address">
              Landlord / property manager address
            </label>
            <input
              className="form-input"
              id="l-landlord-address"
              type="text"
              placeholder="456 Oak Ave, Suite 100, City, State ZIP"
              value={landlordAddress}
              onChange={(e) => setLandlordAddress(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="l-date">
              Today&apos;s date
            </label>
            <input
              className="form-input"
              id="l-date"
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="l-type">
            Letter type
          </label>
          <select
            className="form-input"
            id="l-type"
            value={letterType}
            onChange={(e) => setLetterType(e.target.value as LetterType)}
          >
            <option value="repairs">Repair request</option>
            <option value="deposit">Security deposit return demand</option>
            <option value="privacy">Illegal entry / privacy violation</option>
            <option value="habitability">Uninhabitable conditions</option>
            <option value="retaliation">Landlord retaliation</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="l-details">
            Describe your specific situation
          </label>
          <textarea
            className="form-input"
            id="l-details"
            rows={3}
            placeholder={LETTER_PLACEHOLDERS[letterType] || ""}
            style={{ resize: "vertical" }}
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />
        </div>
        <div className="btn-row" style={{ marginTop: 0 }}>
          <button className="btn btn-primary" type="button" onClick={generateLetter}>
            <svg viewBox="0 0 24 24">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
            Generate letter
          </button>
        </div>
      </div>

      {showResult ? (
        <div id="letter-result" style={{ display: "block" }} ref={resultRef}>
          <div className="sec-label" style={{ marginTop: "1.5rem" }}>
            Your letter
          </div>
          <div className="callout callout-blue">
            <svg viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <div>
              This is a starting draft. Review it carefully and adjust any details before sending. For
              serious legal matters, have an attorney review it.
            </div>
          </div>
          <div className="letter-output" id="letter-body">
            {letterText}
          </div>
          <div className="btn-row">
            <button className="btn btn-primary btn-sm" type="button" onClick={copyLetter}>
              <svg viewBox="0 0 24 24">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
              </svg>
              Copy letter
            </button>
            <button className="btn btn-sm" type="button" onClick={printLetter}>
              <svg viewBox="0 0 24 24">
                <polyline points="6 9 6 2 18 2 18 9" />
                <path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" />
                <rect x="6" y="14" width="12" height="8" />
              </svg>
              Print
            </button>
          </div>
        </div>
      ) : (
        <div id="letter-result" style={{ display: "none" }} />
      )}
    </>
  );
}
