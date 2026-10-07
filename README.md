# ðŸ§  AI-Powered Brain MRI Copilot
> **From 3D Segmentation to Evidence-Grounded Insights**  
> An interactive medical AI assistant combining **SAM-Med3D**, **MedGemma**, **Explainable AI (XAI)**, **Medical RAG**, and an **Evidence-Verification Layer**.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

---

## ðŸ”¬ System Architecture

```text
Brain MRI (3D NIfTI/DICOM)
       â”‚
       â–¼
1. SAM-Med3D (3D Volumetric Segmentation)
       â”‚
       â–¼
2. MedGemma (Medical Visual Understanding & Multimodal Reasoning)
       â”‚
       â–¼
3. Feature Fusion & Prediction Layer
       â”‚
       â”œâ”€â”€â–º 4. Explainable AI (Grad-CAM, Attention Maps, SHAP Feature Importance)
       â”‚
       â””â”€â”€â–º 5. Medical RAG (PubMed / NLM API Evidence Retrieval)
                    â”‚
                    â–¼
            6. Verification Agent (Fact-Checking & Hallucination Mitigation)
                    â”‚
                    â–¼
            7. Conversational Copilot Interface
```

---

## ðŸ§© Key Components

### 1. ðŸŒ SAM-Med3D (3D Volumetric Segmentation)
- Performs volumetric voxel segmentation across anatomical structures and lesions.
- Calculates precise volume metrics in $\text{cm}^3$, centroid coordinates, and Dice scores.
- Interactive **Three.js** 3D volume mesh visualization with real-time rotational inspection.

### 2. ðŸ‘ï¸ MedGemma (Visual Understanding & Multimodal Reasoning)
- Extracts rich visual representations from multi-planar MRI slices (Axial, Coronal, Sagittal).
- Couples anatomical spatial structures with clinical textual conditioning.

### 3. ðŸ’¡ Explainable AI (XAI) Suite
- **Grad-CAM & Attention Rollout** heatmaps overlaid on 2D slices.
- Dynamic colormaps (**Jet, Turbo, Viridis, Inferno**) and real-time opacity blending.
- Quantitative **SHAP / Feature Importance** ranking and attribution audit trail.

### 4. ðŸ“š Medical RAG & Evidence Grounding
- Direct integration with **NCBI / PubMed E-utilities API**.
- Retrieves peer-reviewed literature, citation metrics, PMIDs, DOIs, and full abstracts.
- Grounded clinical consensus guidelines from WHO (CNS 5) and NCCN.

### 5. ðŸ›¡ï¸ Verification Agent
- Cross-validates generated diagnostic hypotheses against literature citations.
- Outputs confidence and factuality metrics to eliminate hallucinations.

### 6. ðŸ’¬ Conversational Medical Copilot
- Natural conversational interface supporting the core clinical research queries:
  1. *â€œWhich regions were segmented?â€*
  2. *â€œWhy did the model make this prediction?â€*
  3. *â€œShow me the segmentation and XAI visualization.â€*
  4. *â€œWhat scientific evidence supports this finding?â€*
  5. *â€œCompare these MRI scans.â€*

### 7. ðŸ“ˆ Longitudinal MRI Comparison
- Side-by-side synchronized baseline vs follow-up scan inspector.
- Voxel-wise subtraction delta map for tracking therapeutic tumor regression according to **RANO criteria**.

---

## ðŸš€ Getting Started

### Local Development (Next.js Frontend)

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### GPU Machine Learning Backend (Optional)

When deploying dedicated GPU inference:
```bash
cd python-backend
pip install -r requirements.txt
python main.py
```

---

## â˜ï¸ Vercel Deployment

1. Push this repository to GitHub or GitLab.
2. Import the project into [Vercel](https://vercel.com).
3. Framework Preset: **Next.js**
4. Root Directory: `./`
5. Click **Deploy** â€” zero additional configuration required!
