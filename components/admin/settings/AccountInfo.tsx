import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function AccountInfo({ admin }: { admin: any }) {
  const initials = admin?.name
    ? admin.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  return (
    <div className="flex items-center space-x-6 p-4 border rounded-lg bg-card shadow-sm">
      {/* Avatar */}
      <Avatar className="w-16 h-16">
        <AvatarImage src={admin?.avatarUrl || "/default-avatar.png"} alt={admin?.name} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>

      {/* Info */}
      <div className="space-y-2">
        <div>
          <p className="text-sm text-muted-foreground">Name</p>
          <p className="font-medium">{admin.name}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Email</p>
          <p className="font-medium">{admin.email}</p>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">Role</p>
          <Badge variant={admin.role === "superadmin" ? "default" : "secondary"}>
            {admin.role}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">Status</p>
          {admin.isActive ? (
            <Badge className="bg-green-600 hover:bg-green-700">Active</Badge>
          ) : (
            <Badge className="bg-red-600 hover:bg-red-700">Inactive</Badge>
          )}
        </div>
      </div>
    </div>
  );
}
