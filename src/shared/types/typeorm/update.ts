type AffectedRows = number;
export type UpdateQueryResponse<T = any> = [T[], AffectedRows];

export type TypeormUpdateQueryResponse<T = any> = {
  raw: T[];
  affected?: AffectedRows;
  generatedMaps: Record<string, any>[];
};
