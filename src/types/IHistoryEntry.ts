export type IHistoryEntry<
  WithMember extends "with member" | "without member" = "without member"
> = {
  id: string;
  change: number;
  timestamp: Date;
  message: string;
  adminName: string;
} & (WithMember extends "with member" ? { memberName: string } : {});
