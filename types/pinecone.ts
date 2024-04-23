export type PineconeResponse = {
  matches: PineconeMatch[];
  namespace: string;
};

export type PineconeMatch = {
  id: string;
  score?: number;
  values: number[];
  sparseValues?: PineconeSparseValues;
  metadata?: PineconeMetadata;
};

export type PineconeMetadata = {
  filename?: string;
  loc?: string;
  text?: string;
};

export type PineconeSparseValues = {
  indices: number[];
  values: number[];
};
