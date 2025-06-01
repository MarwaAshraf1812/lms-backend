export type CourseRating = {
  userId: string;
  courseId: string;
  rating: number;
  comment?: string | null;
}

export interface RateCourseResponse {
  averageRating: number;
  totalRatings: number;
  userRating: any;
  message: string;
}
