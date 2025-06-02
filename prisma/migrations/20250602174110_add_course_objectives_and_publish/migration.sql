-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "discount" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "discountEnd" TIMESTAMP(3),
ADD COLUMN     "duration" INTEGER,
ADD COLUMN     "isFree" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isPublished" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "objectives" TEXT[],
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "requirements" TEXT[],
ADD COLUMN     "thumbnail" TEXT;
