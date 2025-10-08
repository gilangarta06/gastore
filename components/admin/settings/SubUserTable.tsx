'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';

import AddSubUserDialog from './AddSubUserDialog';
import EditSubUserDialog from './EditSubUserDialog';
import ResetPasswordDialog from './ResetPasswordDialog';

export default function SubUserTable() {
  const [users, setUsers] = useState<any[]>([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [editUser, setEditUser] = useState<any | null>(null);
  const [resetUser, setResetUser] = useState<any | null>(null);

  useEffect(() => {
    fetchSubUsers();
  }, []);

  const fetchSubUsers = async () => {
    const token = localStorage.getItem('adminToken');
    const res = await fetch('/api/admin/users', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setUsers(data.users || []);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus user ini?')) return;
    const token = localStorage.getItem('adminToken');
    const res = await fetch(`/api/admin/users/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      fetchSubUsers();
    } else {
      const err = await res.json();
      alert(err.error || 'Gagal menghapus user');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setOpenAdd(true)}>Add Sub User</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user._id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    user.isActive
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {user.isActive ? 'Active' : 'Inactive'}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => setEditUser(user)}>
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setResetUser(user)}>
                      Reset Password
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-600 focus:text-red-600"
                      onClick={() => handleDelete(user._id)}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Dialogs */}
      <AddSubUserDialog
        open={openAdd}
        setOpen={setOpenAdd}
        onUserAdded={fetchSubUsers}
      />
      {editUser && (
        <EditSubUserDialog
          user={editUser}
          open={!!editUser}
          setOpen={() => setEditUser(null)}
          onUpdated={fetchSubUsers}
        />
      )}
      {resetUser && (
        <ResetPasswordDialog
          user={resetUser}
          open={!!resetUser}
          setOpen={() => setResetUser(null)}
        />
      )}
    </div>
  );
}
