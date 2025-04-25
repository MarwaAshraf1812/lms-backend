-- CreateTable
CREATE TABLE "ModuleContent" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "data" TEXT,
    "url" TEXT,
    "alt" TEXT,
    "title" TEXT,
    "moduleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ModuleContent_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ModuleContent" ADD CONSTRAINT "ModuleContent_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
