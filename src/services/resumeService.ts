import { SAMPLE_RESUMES } from '../data/mockData';

export interface ResumeUploadResult {
  fileName: string;
  fileSize: string;
  fileSizeBytes: number;
  fileType: string;
  rawText: string;
  pdfBase64?: string;
  uploadedAt: string;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
export const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
export const ALLOWED_EXTENSIONS = ['.pdf', '.txt', '.doc', '.docx'];

export function validateResumeFile(file: File): ValidationResult {
  if (!file) {
    return { isValid: false, error: 'No file selected.' };
  }

  const extension = '.' + file.name.split('.').pop()?.toLowerCase();
  const isExtensionAllowed = ALLOWED_EXTENSIONS.includes(extension);
  const isMimeAllowed = ALLOWED_MIME_TYPES.includes(file.type) || file.type.startsWith('text/');

  if (!isExtensionAllowed && !isMimeAllowed) {
    return {
      isValid: false,
      error: `Unsupported file type (${extension || 'unknown'}). Please upload a PDF or TXT file.`,
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      isValid: false,
      error: `File is too large (${formatFileSize(file.size)}). Maximum allowed size is 10 MB.`,
    };
  }

  if (file.size === 0) {
    return {
      isValid: false,
      error: 'The uploaded file appears to be empty.',
    };
  }

  return { isValid: true };
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

/**
 * Parses raw text from a PDF ArrayBuffer by searching for text operators (Tj, TJ, string literals)
 */
function extractTextFromPdfBuffer(buffer: ArrayBuffer): string {
  try {
    const bytes = new Uint8Array(buffer);
    let str = '';
    const decoder = new TextDecoder('latin1');
    const fullContent = decoder.decode(bytes);

    // Extract text blocks inside BT ... ET (PDF text object operators)
    const textObjects = fullContent.match(/BT[\s\S]*?ET/g);
    const extractedLines: string[] = [];

    if (textObjects && textObjects.length > 0) {
      for (const obj of textObjects) {
        // Extract string literals in parentheses (text)
        const strings = obj.match(/\((?:\\\(|\\\)|[^\)])*\)\s*T[jJ]|\((?:\\\(|\\\)|[^\)])*\)|\[(.*?)\]\s*TJ/g);
        if (strings) {
          for (const s of strings) {
            const clean = s
              .replace(/^[(\[]/, '')
              .replace(/[)\]]\s*T[jJ]?$/, '')
              .replace(/\\([()\\])/g, '$1')
              .trim();
            if (clean.length > 0) {
              extractedLines.push(clean);
            }
          }
        }
      }
    }

    if (extractedLines.length > 5) {
      return extractedLines.join(' ').replace(/\s+/g, ' ').trim();
    }

    // Fallback: strip PDF metadata keywords and clean ASCII printable strings
    const readableStrings = fullContent
      .replace(/stream[\s\S]*?endstream/g, '')
      .replace(/<<[\s\S]*?>>/g, '')
      .replace(/obj[\s\S]*?endobj/g, '')
      .replace(/[^a-zA-Z0-9.,;:+\-#()/@\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (readableStrings.length > 40) {
      return readableStrings;
    }
  } catch (err) {
    console.warn('PDF buffer parsing warning:', err);
  }
  return '';
}

/**
 * Extracts plain text from the uploaded resume file
 */
export async function extractResumeText(file: File): Promise<string> {
  const extension = file.name.split('.').pop()?.toLowerCase();

  // If plain text
  if (extension === 'txt' || file.type.includes('text/plain')) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve((reader.result as string) || '');
      reader.onerror = () => reject(new Error('Failed to read text file'));
      reader.readAsText(file);
    });
  }

  // If PDF
  if (extension === 'pdf' || file.type.includes('pdf')) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const buffer = reader.result as ArrayBuffer;
        const text = extractTextFromPdfBuffer(buffer);
        if (text && text.trim().length > 20) {
          resolve(text);
        } else {
          // If pure scanned PDF without text layer, provide structured notice with fallback
          resolve(
            `[Resume: ${file.name}]\n` +
            `Note: The uploaded PDF was processed. If this is a scanned image PDF, please ensure text is selectable or use the sample resume templates for comprehensive AI analysis.`
          );
        }
      };
      reader.onerror = () => reject(new Error('Failed to read PDF file'));
      reader.readAsArrayBuffer(file);
    });
  }

  // Generic fallback
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string) || `[Resume File: ${file.name}]`);
    reader.readAsText(file);
  });
}

export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1] || '';
      resolve(base64);
    };
    reader.onerror = () => reject(new Error('Failed to encode file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Uploads, validates and extracts text from a student's resume
 */
export async function uploadResume(file: File): Promise<ResumeUploadResult> {
  const validation = validateResumeFile(file);
  if (!validation.isValid) {
    throw new Error(validation.error || 'Invalid file');
  }

  const rawText = await extractResumeText(file);
  let pdfBase64: string | undefined;

  if (file.type.includes('pdf') || file.name.toLowerCase().endsWith('.pdf')) {
    try {
      pdfBase64 = await fileToBase64(file);
    } catch (e) {
      console.warn('Could not read PDF base64:', e);
    }
  }

  return {
    fileName: file.name,
    fileSize: formatFileSize(file.size),
    fileSizeBytes: file.size,
    fileType: file.type || 'application/pdf',
    rawText,
    pdfBase64,
    uploadedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };
}

/**
 * Loads a pre-built sample resume for quick hackathon testing
 */
export function getSampleResume(sampleId: string) {
  return SAMPLE_RESUMES.find((r) => r.id === sampleId) || SAMPLE_RESUMES[0];
}
