'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import AccountInfo from '@/components/admin/settings/AccountInfo';
import SubUserTable from '@/components/admin/settings/SubUserTable';

export default function AdminSettingsPage() {
  const [adminData, setAdminData] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem('adminData');
    if (stored) {
      setAdminData(JSON.parse(stored));
    }
  }, []);

  if (!adminData) {
    return <p className="text-center text-muted-foreground">Loading account info...</p>;
  }

  return (
    <div className="space-y-8">
      {/* Account Info */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Account Information</h2>
        </CardHeader>
        <CardContent>
          <AccountInfo admin={adminData} />
        </CardContent>
      </Card>

      {/* Sub Users */}
      {adminData.role === 'superadmin' && (
        <>
          <Separator />
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Manage Sub Users</h2>
            </CardHeader>
            <CardContent>
              <SubUserTable />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
