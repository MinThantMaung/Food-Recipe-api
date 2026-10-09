/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Recipe` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Recipe` table without a default value. This is not possible if the table is not empty.
  - Made the column `servings` on table `Recipe` required. This step will fail if there are existing NULL values in that column.
  - Made the column `position` on table `RecipeIngredient` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Recipe" ADD COLUMN     "slug" VARCHAR(255) NOT NULL,
ALTER COLUMN "servings" SET NOT NULL,
ALTER COLUMN "servings" SET DEFAULT 1;

-- AlterTable
ALTER TABLE "RecipeIngredient" ALTER COLUMN "position" SET NOT NULL;

-- AlterTable
ALTER TABLE "RecipeStep" ADD COLUMN     "title" VARCHAR(150);

-- CreateTable
CREATE TABLE "SavedRecipe" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "recipeId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedRecipe_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SavedRecipe_recipeId_idx" ON "SavedRecipe"("recipeId");

-- CreateIndex
CREATE UNIQUE INDEX "SavedRecipe_userId_recipeId_key" ON "SavedRecipe"("userId", "recipeId");

-- CreateIndex
CREATE UNIQUE INDEX "Recipe_slug_key" ON "Recipe"("slug");

-- AddForeignKey
ALTER TABLE "SavedRecipe" ADD CONSTRAINT "SavedRecipe_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedRecipe" ADD CONSTRAINT "SavedRecipe_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;
