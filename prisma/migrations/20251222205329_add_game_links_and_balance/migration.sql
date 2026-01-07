-- AlterTable
ALTER TABLE "games" ADD COLUMN "demo_url" TEXT;
ALTER TABLE "games" ADD COLUMN "play_url" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_profiles" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "phone" TEXT,
    "date_of_birth" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zip_code" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "verification_status" TEXT NOT NULL DEFAULT 'pending',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "balance" REAL NOT NULL DEFAULT 0.0,
    "pending_withdrawals" REAL NOT NULL DEFAULT 0.0,
    "active_bonus" REAL NOT NULL DEFAULT 0.0
);
INSERT INTO "new_profiles" ("address", "city", "created_at", "date_of_birth", "email", "full_name", "id", "phone", "state", "updated_at", "verification_status", "verified", "zip_code") SELECT "address", "city", "created_at", "date_of_birth", "email", "full_name", "id", "phone", "state", "updated_at", "verification_status", "verified", "zip_code" FROM "profiles";
DROP TABLE "profiles";
ALTER TABLE "new_profiles" RENAME TO "profiles";
CREATE UNIQUE INDEX "profiles_email_key" ON "profiles"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
