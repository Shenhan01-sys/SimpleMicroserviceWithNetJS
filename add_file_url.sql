-- Add fileUrl column to materials table
-- Migration: Add file upload support

ALTER TABLE "materials" 
ADD COLUMN "fileUrl" TEXT;

-- Make content column nullable (optional)
ALTER TABLE "materials" 
ALTER COLUMN "content" DROP NOT NULL;
