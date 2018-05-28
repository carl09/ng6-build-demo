export interface IBuildConfig {
  index: string;
  outputPath: string;
  main: string;
  tsConfig: string;
  prod?: boolean;
}
