"use client";

import { useState, useEffect } from "react";
import SessionCardVisual from "./SessionCardVisual";
import { useParent } from "@/context/ParentContext";

interface FormFields {
  childName: string;
  birthYear: string;
  parentName: string;
  phone: string;
}

const EMPTY_FIELDS: FormFields = {
  childName: "",
  birthYear: "",
  parentName: "",
  phone: "",
};

const BIRTH_YEARS = Array.from({ length: 10 }, (_, i) => 2018 - i); // 2018–2009

function validate(f: FormFields): Partial<FormFields> {
  const errors: Partial<FormFields> = {};

  if (!f.childName.trim()) errors.childName = "שדה חובה";

  if (!f.birthYear) {
    errors.birthYear = "שדה חובה";
  }

  if (!f.parentName.trim()) errors.parentName = "שדה חובה";

  if (!f.phone.trim()) {
    errors.phone = "שדה חובה";
  } else {
    const digits = f.phone.replace(/[\s\-]/g, "");
    if (!/^\d+$/.test(digits) || !digits.startsWith("0") || digits.length < 9 || digits.length > 10) {
      errors.phone = "מספר לא תקין (לדוגמה: 050-0000000)";
    }
  }

  return errors;
}

export default function PurchaseModal() {
  const { purchaseCard } = useParent();
  const [isOpen, setIsOpen] = useState(false);
  const [fields, setFields] = useState<FormFields>(EMPTY_FIELDS);
  const [errors, setErrors] = useState<Partial<FormFields>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  function handleOpen() {
    setFields(EMPTY_FIELDS);
    setErrors({});
    setSuccess(false);
    setSubmitError("");
    setIsOpen(true);
  }

  function handleClose() {
    setIsOpen(false);
  }

  function handleChange(key: keyof FormFields, value: string) {
    setFields((prev) => ({ ...prev, [key]: value }));
    // Clear error on change
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate(fields);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setSubmitting(true);
    setSubmitError("");
    const result = await purchaseCard(fields.childName, fields.birthYear);
    setSubmitting(false);

    if (result === "ok" || result === "duplicate") {
      setSuccess(true);
    } else if (result === "unauthenticated") {
      setSubmitError("יש להתחבר לחשבון לפני רכישת כרטיסייה.");
    } else {
      setSubmitError("אירעה שגיאה. נסה שוב.");
    }
  }

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={handleOpen}
        className="glow-gold inline-flex items-center justify-center px-12 py-5 rounded-2xl font-black text-xl transition-transform hover:scale-105 active:scale-100"
        style={{
          background: "linear-gradient(135deg, #c9a84c 0%, #e8c97a 50%, #c9a84c 100%)",
          color: "#07100e",
        }}
      >
        רכישת כרטיסייה
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6"
          style={{
            background: "rgba(4, 8, 16, 0.9)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
          }}
          onClick={handleClose}
        >
          {/* Modal panel */}
          <div
            className="w-full sm:max-w-md flex flex-col rounded-t-3xl sm:rounded-3xl overflow-hidden max-h-[92dvh] sm:max-h-[90vh]"
            style={{
              background: "#0c1422",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle bar – mobile only */}
            <div className="flex justify-center pt-3 pb-1 sm:hidden flex-shrink-0">
              <div className="w-10 h-1 rounded-full bg-white/20" />
            </div>

            {/* Fixed header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.07] flex-shrink-0">
              <div>
                <span className="text-white font-bold text-sm">רכישת כרטיסייה</span>
                <span className="text-gray-600 text-xs block leading-tight mt-0.5">
                  שלב 1 מתוך 2 – פרטים אישיים
                </span>
              </div>
              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 transition-colors text-lg leading-none"
                aria-label="סגור"
              >
                ✕
              </button>
            </div>

            {/* Scrollable body */}
            <form
              onSubmit={handleSubmit}
              noValidate
              className="overflow-y-auto flex-1 p-5 pb-7 space-y-5"
            >
              {success ? (
                <div
                  className="rounded-2xl px-5 py-8 text-center space-y-2"
                  style={{
                    background: "rgba(0,200,83,0.08)",
                    border: "1px solid rgba(0,200,83,0.25)",
                  }}
                >
                  <p className="text-lg font-bold" style={{ color: "#00c853" }}>
                    הפרטים נשמרו!
                  </p>
                  <p className="text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
                    הפרטים נשמרו. תשלום יתווסף בשלב הבא.
                  </p>
                  <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>
                    הכרטיסייה נוספה לאזור האישי שלך
                  </p>
                </div>
              ) : null}

              {!success && (
                <>
                  {/* Session card visual */}
                  <SessionCardVisual />

                  {/* Product description + stats */}
                  <div>
                    <p className="text-gray-400 text-sm text-center mb-4">
                      10 אימונים קבוצתיים לשחקנים בגילאי 8–17
                    </p>
                    <div className="grid grid-cols-3 gap-2.5">
                      {[
                        { label: "כניסות", value: "10" },
                        { label: "תוקף", value: "עד 24.6.2026" },
                        { label: "מחיר", value: "₪1,600" },
                      ].map((item) => (
                        <div
                          key={item.label}
                          className="rounded-xl py-3 px-2 text-center"
                          style={{
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.07)",
                          }}
                        >
                          <div className="text-white font-black text-base leading-tight">
                            {item.value}
                          </div>
                          <div className="text-gray-600 text-xs mt-0.5">{item.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-white/[0.06]" />

                  {/* Form fields */}
                  <div className="space-y-4">
                    {/* Row 1: child name + birth year */}
                    <div className="grid grid-cols-2 gap-3">
                      <Field
                        label="שם הילד/ה"
                        id="childName"
                        type="text"
                        placeholder="שם פרטי"
                        value={fields.childName}
                        error={errors.childName}
                        onChange={(v) => handleChange("childName", v)}
                      />
                      <div>
                        <label
                          htmlFor="birthYear"
                          className="block text-xs font-semibold mb-1.5"
                          style={{ color: "#9ca3af" }}
                        >
                          שנת לידה
                        </label>
                        <select
                          id="birthYear"
                          value={fields.birthYear}
                          onChange={(e) => handleChange("birthYear", e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-colors outline-none appearance-none"
                          style={{
                            background: "rgba(255,255,255,0.06)",
                            border: `1px solid ${errors.birthYear ? "#ef4444" : "rgba(255,255,255,0.1)"}`,
                            color: fields.birthYear ? "#ffffff" : "#6b7280",
                          }}
                        >
                          <option value="" disabled>
                            בחר שנה
                          </option>
                          {BIRTH_YEARS.map((y) => (
                            <option key={y} value={y} style={{ background: "#0c1422" }}>
                              {y}
                            </option>
                          ))}
                        </select>
                        {errors.birthYear && (
                          <p className="text-red-500 text-xs mt-1">{errors.birthYear}</p>
                        )}
                      </div>
                    </div>

                    {/* Row 2: parent name + phone */}
                    <div className="grid grid-cols-2 gap-3">
                      <Field
                        label="שם הורה"
                        id="parentName"
                        type="text"
                        placeholder="שם מלא"
                        value={fields.parentName}
                        error={errors.parentName}
                        onChange={(v) => handleChange("parentName", v)}
                      />
                      <Field
                        label="טלפון"
                        id="phone"
                        type="tel"
                        placeholder="050-0000000"
                        value={fields.phone}
                        error={errors.phone}
                        onChange={(v) => handleChange("phone", v)}
                        dir="ltr"
                        inputMode="tel"
                      />
                    </div>
                  </div>

                  {submitError && (
                    <p className="text-red-500 text-sm text-center">{submitError}</p>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 rounded-2xl font-black text-base transition-transform active:scale-100"
                    style={{
                      background: submitting
                        ? "rgba(255,255,255,0.1)"
                        : "linear-gradient(135deg, #c9a84c 0%, #e8c97a 50%, #c9a84c 100%)",
                      color: submitting ? "rgba(255,255,255,0.4)" : "#07100e",
                      boxShadow: submitting ? "none" : "0 0 28px rgba(201,168,76,0.3)",
                      cursor: submitting ? "not-allowed" : "pointer",
                    }}
                  >
                    {submitting ? "שולח..." : "המשך לתשלום"}
                  </button>

                  <p className="text-center text-gray-700 text-xs">
                    ניתן לבטל עד 24 שעות לפני האימון
                  </p>
                </>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
}

// ── Field helper component ────────────────────────────────────────────────────

interface FieldProps {
  label: string;
  id: string;
  type: string;
  placeholder: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  dir?: string;
  inputMode?: React.InputHTMLAttributes<HTMLInputElement>["inputMode"];
}

function Field({ label, id, type, placeholder, value, error, onChange, dir, inputMode }: FieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-xs font-semibold mb-1.5"
        style={{ color: "#9ca3af" }}
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        dir={dir}
        inputMode={inputMode}
        className="w-full px-3 py-2.5 rounded-xl text-sm font-medium placeholder:text-gray-700 transition-colors outline-none"
        style={{
          background: "rgba(255,255,255,0.06)",
          border: `1px solid ${error ? "#ef4444" : "rgba(255,255,255,0.1)"}`,
          color: "#ffffff",
        }}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
