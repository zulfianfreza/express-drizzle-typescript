export type AccountPurpose = {
  id: number;
  code: string;
  name: string;
  description?: string;
  is_active?: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateAccountPurpose = {
  code: string;
  name: string;
  description?: string;
  is_active?: boolean;
};

export type UpdateAccountPurpose = {
  code?: string;
  name?: string;
  description?: string;
  isActive?: boolean;
};
