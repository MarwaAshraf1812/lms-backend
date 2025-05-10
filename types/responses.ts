type RateCourseMessage = "Rating updated" | "Rating created"

export type CourseRating = {
  userId: string;
  courseId: string;
  rating: number;
  comment?: string | null;
}


export type RateCourseResponse = {
  averageRating: number;
  totalRatings: number;
  userRating: CourseRating;
  comment?: string | null;
  message: RateCourseMessage;
}