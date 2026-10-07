import { BrainRegion, PubMedArticle, FeatureImportance, ChatMessage, PipelineStep } from "@/types";

export const sampleRegions: BrainRegion[] = [
  {
    id: "r1",
    name: "Left Temporal Lobe",
    label: 1,
    color: "#ff6b6b",
    volume: 89.4,
    volumeUnit: "cm\u00b3",
    confidence: 0.96,
    centroid: [120, 140, 80],
    description: "The temporal lobe is involved in processing auditory information and is also important for the processing of semantics in both speech and vision.",
    clinicalSignificance: "Region of interest for temporal lobe epilepsy and language processing disorders"
  },
  {
    id: "r2",
    name: "Right Frontal Cortex",
    label: 2,
    color: "#4ecdc4",
    volume: 112.7,
    volumeUnit: "cm\u00b3",
    confidence: 0.94,
    centroid: [60, 80, 120],
    description: "The frontal cortex is associated with executive functions including planning, decision making, and moderating social behavior.",
    clinicalSignificance: "Key area for assessing neurodegenerative diseases and traumatic brain injury"
  },
  {
    id: "r3",
    name: "Hippocampus",
    label: 3,
    color: "#45b7d1",
    volume: 3.8,
    volumeUnit: "cm\u00b3",
    confidence: 0.98,
    centroid: [130, 120, 60],
    description: "The hippocampus plays critical roles in memory consolidation, spatial navigation, and emotional responses.",
    clinicalSignificance: "Primary biomarker for Alzheimer''s disease; volume reduction correlates with cognitive decline"
  },
  {
    id: "r4",
    name: "Cerebellum",
    label: 4,
    color: "#96ceb4",
    volume: 154.2,
    volumeUnit: "cm\u00b3",
    confidence: 0.97,
    centroid: [128, 180, 40],
    description: "The cerebellum coordinates voluntary movements, balance, equilibrium, and muscle tone.",
    clinicalSignificance: "Assessed for cerebellar ataxia and posterior fossa tumors"
  },
  {
    id: "r5",
    name: "Caudate Nucleus",
    label: 5,
    color: "#feca57",
    volume: 7.2,
    volumeUnit: "cm\u00b3",
    confidence: 0.93,
    centroid: [110, 100, 90],
    description: "Part of the basal ganglia, involved in motor control, learning, and memory.",
    clinicalSignificance: "Relevant in Huntington''s disease and Parkinson''s disease assessment"
  },
  {
    id: "r6",
    name: "Thalamus",
    label: 6,
    color: "#ff9ff3",
    volume: 8.1,
    volumeUnit: "cm\u00b3",
    confidence: 0.95,
    centroid: [128, 128, 75],
    description: "The thalamus relays sensory and motor signals to the cerebral cortex and regulates consciousness and sleep.",
    clinicalSignificance: "Key relay structure; lesions associated with thalamic pain syndrome"
  },
  {
    id: "r7",
    name: "Corpus Callosum",
    label: 7,
    color: "#54a0ff",
    volume: 5.4,
    volumeUnit: "cm\u00b3",
    confidence: 0.91,
    centroid: [128, 110, 100],
    description: "The largest white matter structure connecting the left and right cerebral hemispheres.",
    clinicalSignificance: "Thinning observed in multiple sclerosis and agenesis of the corpus callosum"
  },
  {
    id: "r8",
    name: "Periventricular Region",
    label: 8,
    color: "#c44dff",
    volume: 12.3,
    volumeUnit: "cm\u00b3",
    confidence: 0.89,
    centroid: [128, 128, 85],
    description: "The area surrounding the brain ventricles, containing important white matter tracts.",
    clinicalSignificance: "Common site for white matter lesions in multiple sclerosis and vascular dementia"
  }
];

export const sampleFeatures: FeatureImportance[] = [
  { name: "Hippocampal Volume", value: 0.92, category: "high" },
  { name: "Cortical Thickness", value: 0.85, category: "high" },
  { name: "Ventricular Ratio", value: 0.78, category: "high" },
  { name: "White Matter Integrity", value: 0.71, category: "medium" },
  { name: "Temporal Lobe Asymmetry", value: 0.65, category: "medium" },
  { name: "Caudate Volume", value: 0.58, category: "medium" },
  { name: "Frontal Atrophy Index", value: 0.45, category: "low" },
  { name: "Sulcal Width", value: 0.38, category: "low" },
  { name: "Gray Matter Density", value: 0.32, category: "low" },
  { name: "Cerebellar Volume", value: 0.22, category: "low" },
];

export const sampleArticles: PubMedArticle[] = [
  {
    pmid: "35241567",
    title: "Deep Learning-Based Brain MRI Segmentation for Volumetric Analysis in Alzheimer''s Disease",
    authors: ["Zhang, L.", "Wang, K.", "Chen, M.", "Liu, S."],
    journal: "NeuroImage: Clinical",
    year: 2024,
    abstract: "This study presents a comprehensive deep learning approach for automated brain MRI segmentation, specifically designed for volumetric analysis in Alzheimer''s disease. Our method achieves state-of-the-art Dice scores across multiple brain regions and demonstrates strong correlation with manual expert annotations.",
    doi: "10.1016/j.nicl.2024.103456",
    url: "https://pubmed.ncbi.nlm.nih.gov/35241567/",
    citationCount: 127,
    relevanceScore: 0.95
  },
  {
    pmid: "36789012",
    title: "Hippocampal Volume as a Biomarker for Early Detection of Neurodegenerative Diseases: A Meta-Analysis",
    authors: ["Johnson, R.", "Smith, A.", "Patel, D."],
    journal: "Brain",
    year: 2024,
    abstract: "This meta-analysis examines the diagnostic value of hippocampal volume measurements in the early detection of neurodegenerative diseases. Across 45 studies with 12,000+ participants, hippocampal atrophy showed high sensitivity (89%) and specificity (85%) for predicting conversion from MCI to AD.",
    doi: "10.1093/brain/awae123",
    url: "https://pubmed.ncbi.nlm.nih.gov/36789012/",
    citationCount: 89,
    relevanceScore: 0.91
  },
  {
    pmid: "37654321",
    title: "Explainable AI in Medical Imaging: Attention Mechanisms for Interpretable Brain Lesion Detection",
    authors: ["Kim, J.", "Park, H.", "Lee, Y.", "Brown, T."],
    journal: "Medical Image Analysis",
    year: 2025,
    abstract: "We propose a novel explainable AI framework that combines attention-based mechanisms with gradient-weighted class activation mapping for interpretable brain lesion detection. Our approach provides both visual and quantitative explanations that align with radiologist annotations.",
    doi: "10.1016/j.media.2025.102789",
    url: "https://pubmed.ncbi.nlm.nih.gov/37654321/",
    citationCount: 54,
    relevanceScore: 0.88
  },
  {
    pmid: "38901234",
    title: "SAM-Med3D: Segment Anything in 3D Medical Images with Foundation Models",
    authors: ["Wang, H.", "Guo, S.", "Zhang, X.", "Li, F."],
    journal: "Nature Methods",
    year: 2025,
    abstract: "We present SAM-Med3D, a foundation model for universal 3D medical image segmentation. By adapting the Segment Anything Model to volumetric medical data, SAM-Med3D achieves remarkable zero-shot and few-shot performance across diverse medical imaging modalities.",
    doi: "10.1038/s41592-025-02345",
    url: "https://pubmed.ncbi.nlm.nih.gov/38901234/",
    citationCount: 203,
    relevanceScore: 0.97
  },
  {
    pmid: "39012345",
    title: "Retrieval-Augmented Generation for Evidence-Based Clinical Decision Support in Neuroimaging",
    authors: ["Garcia, M.", "Anderson, K.", "Wu, R."],
    journal: "The Lancet Digital Health",
    year: 2025,
    abstract: "This study introduces a RAG-based clinical decision support system for neuroimaging that retrieves and synthesizes evidence from medical literature to support diagnostic reasoning. The system demonstrated improved accuracy and reduced hallucination rates compared to standard LLM approaches.",
    doi: "10.1016/S2589-7500(25)00123-4",
    url: "https://pubmed.ncbi.nlm.nih.gov/39012345/",
    citationCount: 67,
    relevanceScore: 0.93
  }
];

export const sampleChatMessages: ChatMessage[] = [
  {
    id: "msg1",
    role: "assistant",
    content: "Welcome to the Brain MRI Copilot! I''m ready to help you analyze brain MRI scans, explain AI predictions, and find relevant scientific evidence. You can upload an MRI scan or ask me questions about brain imaging analysis.\n\nHere are some things I can help you with:\n\n- **Segmentation Analysis** \u2014 Identify and measure brain regions\n- **XAI Explanations** \u2014 Understand why the model made specific predictions\n- **Literature Search** \u2014 Find relevant research papers and clinical guidelines\n- **Comparative Analysis** \u2014 Compare multiple scans over time",
    timestamp: new Date().toISOString()
  }
];

export const pipelineSteps: PipelineStep[] = [
  { id: "s1", name: "Input", icon: "\ud83e\udde0", status: "completed", description: "Brain MRI Upload" },
  { id: "s2", name: "SAM-Med3D", icon: "\ud83d\udd2c", status: "completed", description: "3D Segmentation" },
  { id: "s3", name: "MedGemma", icon: "\ud83d\udc41\ufe0f", status: "active", description: "Visual Understanding" },
  { id: "s4", name: "Fusion", icon: "\u2699\ufe0f", status: "pending", description: "Feature Fusion" },
  { id: "s5", name: "XAI", icon: "\ud83d\udca1", status: "pending", description: "Explainable AI" },
  { id: "s6", name: "RAG", icon: "\ud83d\udcda", status: "pending", description: "Evidence Retrieval" },
  { id: "s7", name: "Verify", icon: "\u2705", status: "pending", description: "Verification" },
];

export const dashboardStats = [
  { label: "Scans Analyzed", value: "2,847", change: "+12%", positive: true, color: "blue", icon: "\ud83e\udde0" },
  { label: "Regions Segmented", value: "18,429", change: "+8%", positive: true, color: "cyan", icon: "\ud83d\udd2c" },
  { label: "Evidence Retrieved", value: "4,215", change: "+23%", positive: true, color: "purple", icon: "\ud83d\udcda" },
  { label: "Accuracy Score", value: "94.7%", change: "+2.1%", positive: true, color: "green", icon: "\ud83c\udfaf" },
];
