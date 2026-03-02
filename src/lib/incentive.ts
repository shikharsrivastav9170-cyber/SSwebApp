import { supabase } from "./supabaseClient";

export async function calculateIncentive(employeeId: string) {
  const { data: sales } = await supabase
    .from("sales")
    .select("amount")
    .eq("employee_id", employeeId);

  const revenue =
    sales?.reduce((acc, s) => acc + Number(s.amount), 0) || 0;

  const { data: target } = await supabase
    .from("targets")
    .select("target_amount")
    .eq("employee_id", employeeId)
    .single();

  const targetAmount = target?.target_amount || 0;
  const achievement = (revenue / targetAmount) * 100;

  const { data: rules } = await supabase
    .from("incentive_rules")
    .select("*");

  let incentive = 0;

  rules?.forEach((rule) => {
    if (
      achievement >= rule.min_percentage &&
      achievement <= rule.max_percentage
    ) {
      incentive = revenue * (rule.incentive_percentage / 100);
    }
  });

  return { revenue, incentive, achievement };
}
