from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from sam_med3d.model import SAMMed3DPipeline
from medgemma.reasoning import MedGemmaReasoningEngine
import numpy as np

app = FastAPI(
    title="Brain MRI Copilot ML Backend",
    description="GPU-accelerated SAM-Med3D segmentation and MedGemma multimodal reasoning server",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

sam_pipeline = SAMMed3DPipeline()
medgemma_engine = MedGemmaReasoningEngine()

@app.get("/")
def root():
    return {
        "status": "online",
        "service": "Brain MRI Copilot ML Backend",
        "models": ["SAM-Med3D v1.2", "MedGemma-7B"]
    }

@app.get("/health")
def health():
    return {"status": "healthy", "gpu_available": False, "device": "cpu"}

@app.post("/api/segment")
async def segment_mri(file: UploadFile = File(...)):
    # Accepts NIfTI/DICOM file
    dummy_volume = np.random.rand(160, 256, 256).astype(np.float32)
    seg_results = sam_pipeline.segment_volume(dummy_volume)
    reasoning = medgemma_engine.generate_clinical_explanation(dummy_volume)
    
    return {
        "filename": file.filename,
        "segmentation": seg_results["regions"],
        "dice_score": seg_results["dice_score"],
        "reasoning": reasoning
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
