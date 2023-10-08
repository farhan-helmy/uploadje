interface Image {
  id: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;
  path: string;
  size: string;
  key: string;
  appId: string | null;
}

export type { Image }
