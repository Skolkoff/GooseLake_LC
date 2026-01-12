import { AdminUser } from '../../shared/api/adminTypes';

export const adminUsers: (AdminUser & { password: string })[] = [
  {
    id: "user-admin-001",
    fullName: "Super Admin",
    email: "admin@goose.lake",
    password: "password",
    role: "ADMIN",
    isActive: true,
    createdAtIso: "2024-01-01T10:00:00Z"
  },
  {
    id: "user-manager-001",
    fullName: "Office Manager",
    email: "manager@goose.lake",
    password: "password",
    role: "MANAGER",
    isActive: true,
    createdAtIso: "2024-01-15T10:00:00Z"
  },
  {
    id: "user-chef-001",
    fullName: "Head Chef",
    email: "chef@goose.lake",
    password: "password",
    role: "CHEF",
    isActive: true,
    createdAtIso: "2024-02-01T10:00:00Z"
  }
];
