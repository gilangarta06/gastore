'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function ResetPasswordDialog({
  user,
  open,
  setOpen,
}: {
  user: any;
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (password.length < 6) {
      alert('Password minimal 6 karakter');
      return;
    }
    setLoading(true);
    const token = localStorage.getItem('adminToken');
    const res = await fetch(`/api/admin/users/${user._id}/password`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (res.ok) {
      alert('Password berhasil direset');
      setOpen(false);
      setPassword('');
    } else {
      const err = await res.json();
      alert(err.error || 'Gagal reset password');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reset Password</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>New Password</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password baru"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleReset} disabled={loading}>
            {loading ? 'Saving...' : 'Reset'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
