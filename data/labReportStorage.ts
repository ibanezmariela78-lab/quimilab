import AsyncStorage from "@react-native-async-storage/async-storage";

export const LAB_REPORT_SNAPSHOT_KEY = "quimilab:lab-report-snapshot";

export type LabReportSnapshot = {
  title: string;
  objective: string;
  substances: string[];
  calculation: string;
  theoreticalResult: string;
  materials: string[];
  procedure: string[];
  safety: string[];
  foundation: string;
};

export async function saveLabReportSnapshot(
  snapshot: LabReportSnapshot,
): Promise<void> {
  await AsyncStorage.setItem(
    LAB_REPORT_SNAPSHOT_KEY,
    JSON.stringify(snapshot),
  );
}

export async function loadLabReportSnapshot(): Promise<LabReportSnapshot | null> {
  const stored = await AsyncStorage.getItem(LAB_REPORT_SNAPSHOT_KEY);

  if (!stored) {
    return null;
  }

  return JSON.parse(stored) as LabReportSnapshot;
}
