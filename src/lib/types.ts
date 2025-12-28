export type UserProfile = {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  role: 'admin' | 'viewer';
};

export type DashboardLink = {
  id: string;
  name: string;
  url: string;
  section: string;
  type: 'embed' | 'external' | 'protocol';
  order: number;
  imageUrl?: string;
  imageHint?: string;
};
