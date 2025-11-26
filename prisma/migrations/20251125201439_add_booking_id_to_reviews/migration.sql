-- Step 1: Drop the old unique constraint on (user_id, tour_id)
DROP INDEX IF EXISTS "reviews_user_id_tour_id_key";

-- Step 2: Add booking_id column (nullable first to handle existing data)
ALTER TABLE "reviews" ADD COLUMN IF NOT EXISTS "booking_id" INTEGER;

-- Step 3: For existing reviews, we need to map them to bookings
-- This assumes each review can be matched to a booking by user_id and tour_id
-- If there are multiple bookings for the same user and tour, we'll take the most recent one
UPDATE "reviews" r
SET "booking_id" = (
  SELECT b."booking_id"
  FROM "bookings" b
  WHERE b."user_id" = r."user_id"
    AND b."tour_id" = r."tour_id"
    AND b."status" = 'confirmed'
  ORDER BY b."created_at" DESC
  LIMIT 1
)
WHERE "booking_id" IS NULL;

-- Step 4: Delete reviews that cannot be matched to a booking
-- (This is necessary because booking_id will be required and unique)
DELETE FROM "reviews" WHERE "booking_id" IS NULL;

-- Step 5: Make booking_id NOT NULL and add foreign key constraint
ALTER TABLE "reviews"
  ALTER COLUMN "booking_id" SET NOT NULL,
  ADD CONSTRAINT "reviews_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("booking_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Step 6: Add unique constraint on booking_id
CREATE UNIQUE INDEX "reviews_booking_id_key" ON "reviews"("booking_id");

-- Step 7: Add index on user_id (if not exists)
CREATE INDEX IF NOT EXISTS "reviews_user_id_idx" ON "reviews"("user_id");

