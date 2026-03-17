interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
  light?: boolean; // kept for API compatibility
}

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  centered = false,
}: SectionHeadingProps) {
  return (
    <div className={`mb-12 ${centered ? "text-center" : ""}`}>
      {eyebrow && (
        <span className="inline-block text-xs font-bold tracking-widest text-indigo uppercase mb-3">
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl md:text-4xl font-black leading-tight text-white">
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-4 text-lg max-w-2xl text-gray-400 ${centered ? "mx-auto" : ""}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
