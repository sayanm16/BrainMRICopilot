import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Brain MRI Copilot | AI-Powered 3D Segmentation & Analysis",
  description: "An interactive AI system combining SAM-Med3D segmentation, MedGemma understanding, Explainable AI, and Medical RAG for transparent brain MRI analysis.",
  keywords: ["Brain MRI", "AI", "Segmentation", "SAM-Med3D", "MedGemma", "Explainable AI", "Medical RAG", "Neuroimaging"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
