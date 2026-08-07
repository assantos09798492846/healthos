-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('OWNER', 'ADMIN', 'HEALTH_PROFESSIONAL', 'VIEWER');

-- CreateEnum
CREATE TYPE "SexAtBirth" AS ENUM ('MALE', 'FEMALE', 'INTERSEX', 'NOT_INFORMED');

-- CreateEnum
CREATE TYPE "ClinicalDocumentType" AS ENUM ('LABORATORY_REPORT', 'IMAGING_REPORT', 'PRESCRIPTION', 'MEDICAL_REPORT', 'VACCINATION_RECORD', 'DISCHARGE_SUMMARY', 'OTHER');

-- CreateEnum
CREATE TYPE "MedicationStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('CREATE', 'READ', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'IMPORT', 'EXPORT', 'AI_ANALYSIS');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" VARCHAR(320) NOT NULL,
    "display_name" VARCHAR(160) NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'OWNER',
    "password_hash" VARCHAR(255),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patients" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "full_name" VARCHAR(200) NOT NULL,
    "birth_date" DATE NOT NULL,
    "sex_at_birth" "SexAtBirth" NOT NULL,
    "cpf" VARCHAR(14),
    "blood_type" VARCHAR(5),
    "height_cm" DECIMAL(5,2),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "patients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medical_records" (
    "id" UUID NOT NULL,
    "patient_id" UUID NOT NULL,
    "clinical_summary" TEXT,
    "relevant_history" TEXT,
    "family_history" TEXT,
    "general_notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "medical_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents" (
    "id" UUID NOT NULL,
    "patient_id" UUID NOT NULL,
    "type" "ClinicalDocumentType" NOT NULL,
    "title" VARCHAR(250) NOT NULL,
    "original_name" VARCHAR(255) NOT NULL,
    "mime_type" VARCHAR(120) NOT NULL,
    "storage_key" VARCHAR(500) NOT NULL,
    "sha256" CHAR(64),
    "file_size_bytes" BIGINT NOT NULL,
    "document_date" DATE,
    "imported_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lab_results" (
    "id" UUID NOT NULL,
    "patient_id" UUID NOT NULL,
    "source_document_id" UUID,
    "test_code" VARCHAR(80),
    "test_name" VARCHAR(250) NOT NULL,
    "category" VARCHAR(120),
    "value_number" DECIMAL(18,6),
    "value_text" VARCHAR(500),
    "unit" VARCHAR(50),
    "reference_low" DECIMAL(18,6),
    "reference_high" DECIMAL(18,6),
    "reference_text" VARCHAR(500),
    "interpretation" VARCHAR(80),
    "collected_at" TIMESTAMP(3),
    "reported_at" TIMESTAMP(3),
    "raw_data" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lab_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medications" (
    "id" UUID NOT NULL,
    "patient_id" UUID NOT NULL,
    "generic_name" VARCHAR(200) NOT NULL,
    "brand_name" VARCHAR(200),
    "dose" VARCHAR(100),
    "route" VARCHAR(80),
    "frequency" VARCHAR(150),
    "indication" VARCHAR(300),
    "start_date" DATE,
    "end_date" DATE,
    "status" "MedicationStatus" NOT NULL DEFAULT 'ACTIVE',
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "medications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" UUID NOT NULL,
    "user_id" UUID,
    "action" "AuditAction" NOT NULL,
    "entity_type" VARCHAR(100) NOT NULL,
    "entity_id" VARCHAR(100),
    "correlation_id" VARCHAR(100),
    "ip_address" VARCHAR(64),
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "patients_user_id_key" ON "patients"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "patients_cpf_key" ON "patients"("cpf");

-- CreateIndex
CREATE INDEX "patients_full_name_idx" ON "patients"("full_name");

-- CreateIndex
CREATE UNIQUE INDEX "medical_records_patient_id_key" ON "medical_records"("patient_id");

-- CreateIndex
CREATE UNIQUE INDEX "documents_storage_key_key" ON "documents"("storage_key");

-- CreateIndex
CREATE INDEX "documents_patient_id_document_date_idx" ON "documents"("patient_id", "document_date");

-- CreateIndex
CREATE INDEX "documents_sha256_idx" ON "documents"("sha256");

-- CreateIndex
CREATE INDEX "lab_results_patient_id_test_name_idx" ON "lab_results"("patient_id", "test_name");

-- CreateIndex
CREATE INDEX "lab_results_patient_id_collected_at_idx" ON "lab_results"("patient_id", "collected_at");

-- CreateIndex
CREATE INDEX "lab_results_source_document_id_idx" ON "lab_results"("source_document_id");

-- CreateIndex
CREATE INDEX "medications_patient_id_status_idx" ON "medications"("patient_id", "status");

-- CreateIndex
CREATE INDEX "audit_logs_user_id_created_at_idx" ON "audit_logs"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "audit_logs_entity_type_entity_id_idx" ON "audit_logs"("entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "audit_logs_correlation_id_idx" ON "audit_logs"("correlation_id");

-- AddForeignKey
ALTER TABLE "patients" ADD CONSTRAINT "patients_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical_records" ADD CONSTRAINT "medical_records_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lab_results" ADD CONSTRAINT "lab_results_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lab_results" ADD CONSTRAINT "lab_results_source_document_id_fkey" FOREIGN KEY ("source_document_id") REFERENCES "documents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medications" ADD CONSTRAINT "medications_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
