# ðŸ§  Brain MRI Copilot - Python ML Backend

This directory houses the GPU-accelerated inference backend for:
- **SAM-Med3D** (Segment Anything in 3D Medical Images)
- **MedGemma** (Google Medical Vision-Language Foundation Model)
- **XAI Engine** (Grad-CAM, Attention Rollout, SHAP)

## Requirements
- Python 3.10+
- NVIDIA GPU with 16GB+ VRAM (CUDA 12.1+)
- PyTorch 2.2+

## Quickstart
```bash
pip install -r requirements.txt
python main.py
```

The service will run on `http://localhost:8000` and can be connected directly to your Next.js application by setting:
`NEXT_PUBLIC_ML_BACKEND_URL=http://localhost:8000` in your Vercel / `.env.local` config.

## Deployment Options
- **Modal / RunPod / Vast.ai**: Serverless GPU container using the provided `Dockerfile`.
- **Google Cloud Run (with GPU)**: Pre-configured for artifact registry push.
