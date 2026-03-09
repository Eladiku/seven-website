interface SessionCardVisualProps {
  usedCount?: number;
}

export default function SessionCardVisual({ usedCount = 0 }: SessionCardVisualProps) {
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
              <div
                className="text-white font-black tracking-widest text-sm leading-tight"
              >
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

        {/* Middle: sport title */}
        <div>
          <div className="text-white font-black text-2xl sm:text-3xl mb-1 leading-tight">
            כדורגל קבוצתי
          </div>
          <div className="text-gray-500 text-xs tracking-widest">
            תכנון · השקעה · תיאום
          </div>
        </div>

        {/* Bottom: session dots grid */}
        <div className="grid grid-cols-5 gap-2">
          {Array.from({ length: 10 }, (_, i) => {
            const used = i < usedCount;
            return used ? (
              <div
                key={i}
                className="aspect-square rounded-full flex items-center justify-center"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-gray-700" />
              </div>
            ) : (
              <div
                key={i}
                className="aspect-square rounded-full"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(201,168,76,0.28), rgba(232,201,122,0.1))",
                  border: "1.5px solid rgba(201,168,76,0.7)",
                  boxShadow: "0 0 8px rgba(201,168,76,0.25)",
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
