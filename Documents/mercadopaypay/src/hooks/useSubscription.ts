import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

export type SubscriptionStatus = {
    isPremium: boolean;
    isTrialActive: boolean;
    hasAccess: boolean;
    loading: boolean;
};

export const useSubscription = () => {
    const { user } = useAuth();
    const [status, setStatus] = useState<SubscriptionStatus>({
        isPremium: false,
        isTrialActive: false,
        hasAccess: true, // Default to true until checked
        loading: true,
    });

    useEffect(() => {
        if (!user) {
            setStatus({ isPremium: false, isTrialActive: false, hasAccess: false, loading: false });
            return;
        }

        const checkSubscription = async () => {
            const { data: profile } = await supabase
                .from("profiles")
                .select("subscription_tier, trial_expires_at")
                .eq("id", user.id)
                .single();

            if (profile) {
                const isPremium = profile.subscription_tier === "premium";
                const trialExpiry = profile.trial_expires_at ? new Date(profile.trial_expires_at) : null;
                const isTrialActive = trialExpiry ? new Date() < trialExpiry : false;

                setStatus({
                    isPremium,
                    isTrialActive,
                    hasAccess: isPremium || isTrialActive,
                    loading: false,
                });
            } else {
                setStatus({ isPremium: false, isTrialActive: false, hasAccess: false, loading: false });
            }
        };

        checkSubscription();
    }, [user]);

    const startTrial = async () => {
        if (!user) return;

        const threeMonthsFromNow = new Date();
        threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);

        const { error } = await supabase
            .from("profiles")
            .update({
                subscription_tier: "premium",
                trial_expires_at: threeMonthsFromNow.toISOString(),
            })
            .eq("id", user.id);

        if (error) throw error;

        // Force re-fetch
        const { data: profile } = await supabase
            .from("profiles")
            .select("subscription_tier, trial_expires_at")
            .eq("id", user.id)
            .single();

        if (profile) {
            const isPremium = profile.subscription_tier === "premium";
            const trialExpiry = profile.trial_expires_at ? new Date(profile.trial_expires_at) : null;
            const isTrialActive = trialExpiry ? new Date() < trialExpiry : false;

            setStatus(prev => ({
                ...prev,
                isPremium,
                isTrialActive,
                hasAccess: isPremium || isTrialActive,
                loading: false,
            }));
        }
    };

    return { ...status, startTrial, user };
};
