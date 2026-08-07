-- CreateEnum
CREATE TYPE "DocumentProcessingStatus" AS ENUM ('QUEUED', 'EXTRACTING_TEXT', 'OCR', 'PARSING', 'VALIDATING', 'REVIEW_REQUIRED', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "DocumentProcessingMethod" AS ENUM ('NATIVE_TEXT', 'OCR', 'HYBRID');

-- CreateTable
CREATE TABLE "document_processing_jobs" (
    "id" UUID NOT NULL,
    "document_id" UUID NOT NULL,
    "status" "DocumentProcessingStatus" NOT NULL DEFAULT 'QUEUED',
    "method" "DocumentProcessingMethod",
    "progress" INTEGER NOT NULL DEFAULT 0,
    "pages_total" INTEGER,
    "pages_processed" INTEGER NOT NULL DEFAULT 0,
    "extracted_text" TEXT,
    "error_message" TEXT,
    "started_at" TIMESTAMP(3),
    "finished_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "document_processing_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "document_processing_jobs_document_id_created_at_idx" ON "document_processing_jobs"("document_id", "created_at");

-- CreateIndex
CREATE INDEX "document_processing_jobs_status_created_at_idx" ON "document_processing_jobs"("status", "created_at");

-- AddForeignKey
ALTER TABLE "document_processing_jobs" ADD CONSTRAINT "document_processing_jobs_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;
