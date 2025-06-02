export interface CreateCourseDTO {
  title: string;
  description: string;
  categoryId: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  language: "English" | "Spanish" | "French" | "Arabic";
  objectives: string[];
  requirements?: string[];
  prerequisites?: string[];
  targetAudience?: string[];
  tags?: string[];
  thumbnail?: string;
  durationMinutes: number;
  price?: number;
  discount?: number;
  discountEnd?: Date;
  isFree?: boolean;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  aiSummary?: string;
  aiKeywords?: string[];
  createdById: string;
}
