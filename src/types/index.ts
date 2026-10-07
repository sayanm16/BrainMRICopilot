export interface MRIUpload {
  id: string;
  filename: string;
  uploadDate: string;
  fileSize: number;
  dimensions: [number, number, number];
  voxelSize: [number, number, number];
  modality: string;
  status: 'uploading' | 'processing' | 'segmenting' | 'analyzing' | 'complete' | 'error';
  progress: number;
}

export interface SegmentationResult {
  id: string;
  mriId: string;
  regions: BrainRegion[];
  timestamp: string;
  model: string;
  processingTime: number;
}

export interface BrainRegion {
  id: string;
  name: string;
  label: number;
  color: string;
  volume: number;
  volumeUnit: string;
  confidence: number;
  centroid: [number, number, number];
  description: string;
  clinicalSignificance?: string;
}

export interface XAIResult {
  id: string;
  mriId: string;
  method: 'gradcam' | 'attention' | 'shap' | 'integrated_gradients';
  heatmapData: number[][];
  featureImportance: FeatureImportance[];
  topRegions: { name: string; score: number; }[];
  timestamp: string;
}

export interface FeatureImportance {
  name: string;
  value: number;
  category: 'high' | 'medium' | 'low';
}

export interface PubMedArticle {
  pmid: string;
  title: string;
  authors: string[];
  journal: string;
  year: number;
  abstract: string;
  doi?: string;
  url: string;
  citationCount?: number;
  relevanceScore: number;
}

export interface VerificationResult {
  claimId: string;
  claim: string;
  status: 'verified' | 'partially_verified' | 'unverified' | 'contradicted';
  confidence: number;
  supportingEvidence: PubMedArticle[];
  reasoning: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  citations?: PubMedArticle[];
  visualizations?: ChatVisualization[];
  isLoading?: boolean;
}

export interface ChatVisualization {
  type: 'heatmap' | 'segmentation' | 'chart' | 'comparison';
  title: string;
  data: any;
}

export interface AnalysisReport {
  id: string;
  mriId: string;
  prediction: string;
  confidence: number;
  segmentation: SegmentationResult;
  xaiResults: XAIResult;
  evidence: PubMedArticle[];
  verifications: VerificationResult[];
  summary: string;
  timestamp: string;
}

export interface PipelineStep {
  id: string;
  name: string;
  icon: string;
  status: 'pending' | 'active' | 'completed' | 'error';
  description: string;
  progress?: number;
}
