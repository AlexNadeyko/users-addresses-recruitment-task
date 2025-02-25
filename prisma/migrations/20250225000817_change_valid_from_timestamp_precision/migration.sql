/*
  Warnings:

  - The primary key for the `users_addresses` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "users" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(6),
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(6);

-- AlterTable
ALTER TABLE "users_addresses" DROP CONSTRAINT "users_addresses_pkey",
ALTER COLUMN "valid_from" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(6),
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(6),
ADD CONSTRAINT "users_addresses_pkey" PRIMARY KEY ("user_id", "address_type", "valid_from");
