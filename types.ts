
export interface GroundingSource {
  uri: string;
  title: string;
}

export interface SummaryResult {
  title: string;
  summary: string;
  keyIdeas: string[];
  sources?: GroundingSource[];
}

export enum DownloadFormat {
  TXT = 'txt',
  MD = 'md',
  HTML = 'html',
}
