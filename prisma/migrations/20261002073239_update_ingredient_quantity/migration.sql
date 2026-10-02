/*
  Warnings:

  - The `quantity` column on the `RecipeIngredient` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "RecipeIngredient" ADD COLUMN     "quantityText" VARCHAR(100),
DROP COLUMN "quantity",
ADD COLUMN     "quantity" DECIMAL(10,3);
