// Shared types for entertainment data

export type FlatNode = {
  id: string;
  type: "folder" | "file";
  childrenIds?: string[];
};

export type FolderPath = string | string[] | undefined;
