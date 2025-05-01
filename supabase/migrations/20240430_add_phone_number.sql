-- Add phone number fields to users table
ALTER TABLE auth.users
ADD COLUMN IF NOT EXISTS phone_number TEXT,
ADD COLUMN IF NOT EXISTS phone_number_verified BOOLEAN DEFAULT FALSE;

-- Create a function to update phone verification status
CREATE OR REPLACE FUNCTION public.update_phone_verification(
    user_id UUID,
    is_verified BOOLEAN
) RETURNS VOID AS $$
BEGIN
    UPDATE auth.users
    SET phone_number_verified = is_verified
    WHERE id = user_id;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER;