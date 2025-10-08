'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

export default function AddSubUserDialog({
  open,
  setOpen,
  onUserAdded,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  onUserAdded: () => void;
}) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'admin', // default role
  });
  const [loading, setLoading] = useState(false);

  const handleAddUser = async () => {
    if (!form.name || !form.email || !form.password) return alert('Isi semua field!');
    setLoading(true);

    const token = localStorage.getItem('adminToken');
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    setLoading(false);
    if (res.ok) {
      onUserAdded();
      setOpen(false);
      setForm({ name: '', email: '', password: '', role: 'admin' });
    } else {
      const err = await res.json();
      alert(err.error || 'Gagal menambahkan user');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Sub User</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Masukkan nama"
            />
          </div>

          <div>
            <Label>Email</Label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="contoh@email.com"
            />
          </div>

          <div>
            <Label>Password</Label>
            <Input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Minimal 6 karakter"
            />
          </div>

          <div>
            <Label>Role</Label>
            <Select
              value={form.role}
              onValueChange={(value) => setForm({ ...form, role: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="superadmin">Super Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddUser} disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
