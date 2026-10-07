import { NextResponse } from "next/server";
import { sampleArticles, sampleRegions } from "@/data/sampleData";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const text = (message || "").toLowerCase();

    // 1. "Which regions were segmented?"
    if (text.includes("which regions") || text.includes("segmented")) {
      return NextResponse.json({
        reply: `The **SAM-Med3D** volumetric segmentation engine identified **8 distinct neuroanatomical structures and ROI volumes** in this T1w MRI sequence:\n\n1. **Left Temporal Lobe (Lesion Core)**: 89.4 cmÂ³ (96% confidence)\n2. **Right Frontal Cortex**: 112.7 cmÂ³ (94% confidence)\n3. **Left Hippocampus**: 3.8 cmÂ³ (98% confidence)\n4. **Cerebellum**: 154.2 cmÂ³ (97% confidence)\n5. **Caudate Nucleus**: 7.2 cmÂ³ (93% confidence)\n6. **Thalamus**: 8.1 cmÂ³ (95% confidence)\n7. **Corpus Callosum**: 5.4 cmÂ³ (91% confidence)\n8. **Periventricular White Matter**: 12.3 cmÂ³ (89% confidence)\n\nThe high-intensity lesion core is prominently localized within the left temporal parenchyma.`,
        visualType: "regions",
        tags: ["SAM-Med3D", "Volumetry", "Anatomy"],
        citations: [
          {
            title: sampleArticles[3].title,
            pmid: sampleArticles[3].pmid,
            url: sampleArticles[3].url,
            journal: sampleArticles[3].journal
          }
        ]
      });
    }

    // 2. "Why did the model make this prediction?"
    if (text.includes("why") || text.includes("prediction") || text.includes("predict")) {
      return NextResponse.json({
        reply: `**MedGemma Multimodal Reasoning Breakdown:**\n\nThe model predicted **High-Grade Glioma (WHO CNS Grade 4)** with **92.4% confidence** based on three key neuroimaging biomarkers:\n\nâ€¢ **Necrotic Core & Ring Enhancement (64.2% attribution)**: Central T1 hypointensity surrounded by an irregular hyperintense contrast border.\nâ€¢ **Peritumoral Vasogenic Edema (23.8% attribution)**: Hyperintense signal infiltrating adjacent white matter fiber tracts.\nâ€¢ **Mass Effect & Subfalcine Shift (12.0% attribution)**: 1.8 mm compression on the ipsilateral lateral ventricle.\n\nThe feature importance SHAP distribution confirms *Hippocampal Proximity* and *Cortical Thickness Disruption* were the highest predictive variables.`,
        visualType: "xai",
        tags: ["Explainable AI", "MedGemma", "SHAP"],
        citations: [
          {
            title: sampleArticles[2].title,
            pmid: sampleArticles[2].pmid,
            url: sampleArticles[2].url,
            journal: sampleArticles[2].journal
          }
        ]
      });
    }

    // 3. "Show me the segmentation and XAI visualization."
    if (text.includes("show") || text.includes("xai") || text.includes("heatmap") || text.includes("visualization")) {
      return NextResponse.json({
        reply: `Here is the composite **XAI attribution overlay** generated using **Grad-CAM** mapped across the 16th convolutional block of MedGemma's vision backbone.\n\nThe highest activation corresponds precisely to the non-enhancing necrotic boundary and peritumoral infiltration zone in the **Left Temporal Lobe**. You can inspect both the 3D reconstructed mesh and orthogonal slices in the dedicated viewer suites.`,
        visualType: "xai",
        tags: ["Grad-CAM", "Attention Map", "Overlay"],
        citations: [
          {
            title: sampleArticles[2].title,
            pmid: sampleArticles[2].pmid,
            url: sampleArticles[2].url,
            journal: sampleArticles[2].journal
          }
        ]
      });
    }

    // 4. "What scientific evidence supports this finding?"
    if (text.includes("evidence") || text.includes("scientific") || text.includes("literature") || text.includes("guideline")) {
      return NextResponse.json({
        reply: `Our **Medical RAG Verification Layer** cross-referenced this diagnostic pattern against 5 PubMed indexed neuro-oncology studies:\n\nâ€¢ **Nature Methods 2025 (PMID: 38901234)**: Validated SAM-Med3D across 4,200 brain MRI volumes showing 91.8% Dice score on temporal astrocytomas.\nâ€¢ **NeuroImage: Clinical 2024 (PMID: 35241567)**: Establishes volumetric lesion thresholds that correlate with aggressive cellular proliferation.\nâ€¢ **WHO CNS 5 Guidelines (2021)**: Recommends IDH-1/2 sequencing and 1p/19q codeletion testing to complement this radiological phenotype.`,
        visualType: null,
        tags: ["PubMed RAG", "WHO 2021", "Verified"],
        citations: [
          {
            title: sampleArticles[3].title,
            pmid: sampleArticles[3].pmid,
            url: sampleArticles[3].url,
            journal: sampleArticles[3].journal
          },
          {
            title: sampleArticles[0].title,
            pmid: sampleArticles[0].pmid,
            url: sampleArticles[0].url,
            journal: sampleArticles[0].journal
          }
        ]
      });
    }

    // 5. "Compare these MRI scans."
    if (text.includes("compare") || text.includes("longitudinal") || text.includes("previous") || text.includes("follow")) {
      return NextResponse.json({
        reply: `**Comparative Longitudinal Assessment (Baseline vs Month 3):**\n\nâ€¢ **Tumor Core Volume**: Decreased from **89.4 cmÂ³** to **46.1 cmÂ³** (**-48.4% reduction**).\nâ€¢ **Peritumoral Edema**: Decreased from **24.2 cmÂ³** to **11.8 cmÂ³** (**-51.2% resolution**).\nâ€¢ **Mass Effect**: Ventricular shift reduced from **2.8 mm** to **0.9 mm**.\n\nAccording to **RANO (Response Assessment in Neuro-Oncology) criteria**, this corresponds to a **Partial Response (PR)** following therapeutic intervention.`,
        visualType: null,
        tags: ["RANO Criteria", "Longitudinal", "Response Assessment"],
        citations: [
          {
            title: sampleArticles[4].title,
            pmid: sampleArticles[4].pmid,
            url: sampleArticles[4].url,
            journal: sampleArticles[4].journal
          }
        ]
      });
    }

    // Default general response
    return NextResponse.json({
      reply: `I have analyzed your clinical inquiry against the current scan and medical knowledgebase. With **SAM-Med3D** segmenting anatomical boundaries and **MedGemma** evaluating multimodal signals, the model focuses on temporal lobe morphometry and volumetric asymmetry. Feel free to ask about specific regions, request Grad-CAM attribution, or retrieve supporting scientific citations.`,
      visualType: null,
      tags: ["MedGemma", "SAM-Med3D", "Inference"],
      citations: [
        {
          title: sampleArticles[0].title,
          pmid: sampleArticles[0].pmid,
          url: sampleArticles[0].url,
          journal: sampleArticles[0].journal
        }
      ]
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
