export interface MemoryArchiveInput {
  user_id: string;
  memory_id: string;
}

export interface MemoryArchiveResponse {
  success: boolean;
  message: string;
  isArchived?: boolean;
}

export interface ArchivedMemory {
  id: string;
  user_id: string;
  memory_id: string;
  archived_date: Date;
  memory: {
    id: string;
    content_url: string;
    content_type: string;
    description: string | null;
    created_at: Date;
  };
}