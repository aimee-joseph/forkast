import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

export async function exportReportPDF(
  elementId: string,
  filename: string
): Promise<void> {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with ID "${elementId}" not found`);
    }

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.95);

    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    const pdfWidth = 297;
    const pdfHeight = 210;

    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = imgWidth / imgHeight;

    let width = pdfWidth;
    let height = pdfWidth / ratio;

    if (height > pdfHeight) {
      height = pdfHeight;
      width = pdfHeight * ratio;
    }

    const x = (pdfWidth - width) / 2;
    const y = (pdfHeight - height) / 2;

    pdf.addImage(imgData, "JPEG", x, y, width, height);
    pdf.save(filename);
  } catch (error: any) {
    throw new Error(`Failed to export PDF: ${error.message || error}`);
  }
}
