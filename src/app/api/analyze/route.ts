import { NextResponse } from "next/server";
import { sampleRegions } from "@/data/sampleData";

export async function POST(req: Request) {
  try {
    const data = await req.json().catch(() => ({}));
    return NextResponse.json({
      status: "success",
      scanId: "SCAN_" + Math.random().toString(36).substring(2, 9),
      model: "SAM-Med3D v1.2 + MedGemma-7B",
      regions: sampleRegions,
      prediction: {
        diagnosis: "High-Grade Glioma (Astrocytoma / Glioblastoma)",
        confidence: 0.924,
        uncertainty: 0.024,
        whoGrade: "WHO CNS Grade 4",
        recommendedSequences: ["T1-CE", "T2-FLAIR", "DWI/ADC", "Perfusion MRI"]
      },
      metrics: {
        totalBrainVolume: "1284.5 cmÂ³",
        totalLesionVolume: "89.4 cmÂ³",
        edemaVolume: "24.2 cmÂ³",
        midlineShift: "1.8 mm"
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
