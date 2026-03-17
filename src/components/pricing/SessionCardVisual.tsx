export default function SessionCardVisual() {
  return (
    <div
      className="relative rounded-2xl overflow-hidden w-full"
      style={{
        background: "linear-gradient(135deg, #1e2d4a 0%, #0c1828 55%, #162035 100%)",
        border: "1px solid rgba(201, 168, 76, 0.22)",
        aspectRatio: "1.65 / 1",
      }}
    >
      {/* Diagonal pattern */}
      <div
        className="absolute inset-0 opacity-[0.045] pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, #c9a84c 0, #c9a84c 1px, transparent 0, transparent 50%)",
          backgroundSize: "18px 18px",
        }}
      />

      {/* Gold radial glow – top right */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: -70,
          right: -70,
          width: 240,
          height: 240,
          background:
            "radial-gradient(circle, rgba(201,168,76,0.18) 0%, transparent 70%)",
        }}
      />

      {/* Bottom left dim glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: -40,
          left: -40,
          width: 160,
          height: 160,
          background:
            "radial-gradient(circle, rgba(201,168,76,0.07) 0%, transparent 70%)",
        }}
      />

      {/* Card content */}
      <div className="relative h-full flex flex-col justify-between p-6 sm:p-8">
        {/* Top row: brand + badge */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <span
              className="font-black leading-none text-3xl sm:text-4xl"
              style={{ color: "#c9a84c" }}
            >
              7
            </span>
            <div>
              <div className="text-white font-black tracking-widest text-sm leading-tight">
                SEVEN
              </div>
              <div
                className="text-gray-500 tracking-widest uppercase"
                style={{ fontSize: 9 }}
              >
                Academy
              </div>
            </div>
          </div>

          <div
            className="text-xs font-semibold px-3 py-1 rounded-full"
            style={{
              background: "rgba(201,168,76,0.12)",
              color: "#c9a84c",
              border: "1px solid rgba(201,168,76,0.28)",
            }}
          >
            כרטיסיית אימון
          </div>
        </div>

        {/* Middle: card name */}
        <div>
          <div className="text-white font-black text-2xl sm:text-3xl mb-1 leading-tight">
            כדורגל קבוצתי
          </div>
          <div className="text-gray-500 text-xs tracking-widest">
            כרטיסיית כדורגל קבוצתי · Seven Academy
          </div>
        </div>

        {/* Bottom: product summary */}
        <div className="flex items-end justify-between">
          <div className="flex gap-5">
            <div>
              <div className="text-xs tracking-widest mb-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>
                אימונים
              </div>
              <div className="text-white font-black text-xl leading-none">10</div>
            </div>
            <div>
              <div className="text-xs tracking-widest mb-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>
                תוקף
              </div>
              <div className="text-white font-black text-xl leading-none">3 חודשים</div>
            </div>
            <div>
              <div className="text-xs tracking-widest mb-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>
                לאימון
              </div>
              <div className="font-black text-xl leading-none" style={{ color: "#c9a84c" }}>
                ₪160
              </div>
            </div>
          </div>

          <div
            className="text-xs font-bold px-2.5 py-1 rounded-full"
            style={{
              background: "rgba(34,197,94,0.12)",
              color: "#86efac",
              border: "1px solid rgba(34,197,94,0.25)",
            }}
          >
            פעיל ✓
          </div>
        </div>
      </div>
    </div>
  );
}
