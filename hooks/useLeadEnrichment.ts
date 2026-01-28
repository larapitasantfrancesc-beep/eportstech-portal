import { useState } from "react";
import { supabase } from "../services/supabaseClient";

interface EnrichmentResult {
  success: boolean;
  lead_id: string;
  enrichment?: {
    company_name: string | null;
    website: string | null;
    sector: string | null;
    description: string | null;
    estimated_size: string | null;
    estimated_employees: string | null;
    location: string | null;
    services_products: string[];
    potential_needs: string[];
    confidence_score: number;
    notes: string | null;
  };
  lead_score?: number;
  error?: string;
}

export function useLeadEnrichment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const enrichLead = async (
    leadId: string,
    tableName: "leads" | "configurator_leads" | "chatbot_leads" | "catalog_leads"
  ): Promise<EnrichmentResult | null> => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke(
        "enrich-lead",
        {
          body: { lead_id: leadId, table_name: tableName },
        }
      );

      if (fnError) throw fnError;
      return data as EnrichmentResult;
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Error desconegut";
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const processQueue = async (batchSize = 10): Promise<EnrichmentResult[]> => {
    setLoading(true);
    setError(null);
    const results: EnrichmentResult[] = [];

    try {
      const { data: pending, error: queueError } = await supabase
        .from("enrichment_queue")
        .select("*")
        .eq("status", "pending")
        .order("created_at")
        .limit(batchSize);

      if (queueError) throw queueError;

      for (const item of pending || []) {
        await supabase
          .from("enrichment_queue")
          .update({ status: "processing" })
          .eq("id", item.id);

        const result = await enrichLead(item.lead_id, item.table_name);

        if (result?.success) {
          await supabase
            .from("enrichment_queue")
            .update({ 
              status: "completed", 
              processed_at: new Date().toISOString() 
            })
            .eq("id", item.id);
        } else {
          await supabase
            .from("enrichment_queue")
            .update({
              status: "failed",
              last_error: result?.error || "Error desconegut",
            })
            .eq("id", item.id);
        }

        if (result) results.push(result);
        await new Promise((r) => setTimeout(r, 500));
      }

      return results;
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Error processant cua";
      setError(msg);
      return results;
    } finally {
      setLoading(false);
    }
  };

  return {
    enrichLead,
    processQueue,
    loading,
    error,
  };
}