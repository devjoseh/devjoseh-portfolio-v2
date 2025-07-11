import { createClient } from "@supabase/supabase-js";

export const createBypassClient = () => {
    return createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY! // Service role key para bypasser RLS
    );
};
