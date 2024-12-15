export type EntryType = 'directory' | 'file';

export interface TreeEntry {
  type: EntryType;
  name: string;
  path: string;
  children?: TreeEntry[];
}
