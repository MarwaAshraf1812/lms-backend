/*
  Warnings:

  - Added the required column `topic` to the `AIResponse` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AIResponse" ADD COLUMN     "topic" TEXT NOT NULL;
