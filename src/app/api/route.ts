import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const kelas = searchParams.get("kelas") || "bsj-sd1";
  const mapel = searchParams.get("mapel") || "PAI";
  const bab = parseInt(searchParams.get("bab") || "1");
  const { data, error } = await supabase.from("soal_super_juara").select("*").eq("kelas", kelas).eq("mapel", mapel).eq("bab", bab).order("no", { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ kelas, mapel, bab, total: data?.length || 0, soal: data });
}
