"use client";
import { useRouter } from "next/navigation";

export default function Header({ title, description }) {
  const router = useRouter();

  return (
    <div className="mb-8" style={{ marginBottom: "130px" }}>
      <h1 className="text-[28px] font-light text-text" style={{ fontFamily: "var(--font-heading)" }}>{title}</h1>
      {description && <p className="text-text-secondary text-[14px] mt-2">{description}</p>}
    </div>
  );
}
