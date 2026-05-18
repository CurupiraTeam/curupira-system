export interface HistoricalStats {
  date: string;
  aqi?: number;
  userReportsCount: number;
  officialAlertsCount: number;
}

export interface HistoricalPoint {
  date: string;
  iqa: number;
  reports: number;
  officialAlerts: number;
}
