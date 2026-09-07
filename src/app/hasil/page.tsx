"use client";
export const dynamic = 'force-dynamic';
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

function HasilContent() {
  const params = useSearchParams();
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(30);
  const waNumber = "6281770220059";
  useEffect(() => {
    const s = parseInt(params.get("score") || "0");
    const t = parseInt(params.get("total") || "30");
    const saved = localStorage.getItem("skor_free");
    if (!params.get("score") && saved) {
      setScore(parseInt(saved));
    } else {
      setScore(s);
    }
    setTotal(t);
  }, [params]);
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Hasil: {score} / {total}</h1>
      <a href={`https://wa.me/${waNumber}`} className="mt-4 inline-block bg-green-500 text-white px-4 py-2 rounded">Hubungi WA</a>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HasilContent />
    </Suspense>
  );
}