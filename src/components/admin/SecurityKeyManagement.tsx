
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Key, Plus, Trash, Shield, AlertTriangle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { registerPasskey, getPasskeys, removePasskey, PasskeyCredential } from "@/lib/webauthn";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle,
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const SecurityKeyManagement: React.FC = () => {
  const { currentUser, isSuperAdmin } = useAuth();
  const { toast } = useToast();
  const [passkeys, setPasskeys] = useState<PasskeyCredential[]>([]);
  const [isAddKeyDialogOpen, setIsAddKeyDialogOpen] = useState(false);
  const [selectedKeyId, setSelectedKeyId] = useState<string | null>(null);
  const [deviceName, setDeviceName] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [keyPurpose, setKeyPurpose] = useState<'general' | 'election'>('general');
  const [keyRole, setKeyRole] = useState<'admin' | 'superadmin'>('admin');

  useEffect(() => {
    fetchPasskeys();
  }, []);

  const fetchPasskeys = async () => {
    const keys = await getPasskeys();
    setPasskeys(keys);
  };

  const handleAddPasskey = async () => {
    if (!currentUser || !isSuperAdmin()) {
      toast({
        title: "Access Denied",
        description: "Only superadmins can register security keys",
        variant: "destructive",
      });
      return;
    }
    
    setIsRegistering(true);
    try {
      const result = await registerPasskey(
        `${deviceName.trim()} (${keyPurpose})`,
        currentUser.uid, // Pass superadmin ID
        keyRole, // Pass the selected role
        keyPurpose // Pass the selected purpose
      );
      
      if (result.success) {
        toast({
          title: "Success",
          description: "Security key registered successfully",
        });
        setIsAddKeyDialogOpen(false);
        setDeviceName("");
        fetchPasskeys();
      } else {
        throw new Error(result.error || 'Registration failed');
      }
    } catch (error: any) {
      console.error('Security key registration error:', error);
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to register security key",
        variant: "destructive",
      });
    } finally {
      setIsRegistering(false);
    }
  };

  const handleDeletePasskey = async () => {
    if (!selectedKeyId) return;
    
    try {
      const result = await removePasskey(selectedKeyId);
      
      if (result.success) {
        toast({
          title: "Success",
          description: "Security key removed successfully",
        });
        setSelectedKeyId(null);
        fetchPasskeys();
      } else {
        throw new Error(result.error || 'Failed to remove security key');
      }
    } catch (error: any) {
      console.error('Security key removal error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to remove security key",
        variant: "destructive",
      });
    }
  };

  // Only super admins can manage security keys
  if (!isSuperAdmin()) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
          <Shield className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">Access Restricted</h3>
          <p className="text-sm text-muted-foreground max-w-md mt-2">
            Only super administrators can manage security keys.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Security Key Management</h2>
        <Dialog open={isAddKeyDialogOpen} onOpenChange={setIsAddKeyDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Register Security Key
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Register New Security Key</DialogTitle>
              <DialogDescription>
                Add a new security key for authentication or election result access
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="device-name" className="col-span-4">
                  Device Name
                </Label>
                <Input
                  id="device-name"
                  value={deviceName}
                  onChange={(e) => setDeviceName(e.target.value)}
                  placeholder="e.g., Election Key 1"
                  className="col-span-4"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="key-purpose" className="col-span-4">
                  Key Purpose
                </Label>
                <select
                  id="key-purpose"
                  value={keyPurpose}
                  onChange={(e) => setKeyPurpose(e.target.value as 'general' | 'election')}
                  className="col-span-4 w-full p-2 border rounded-md"
                >
                  <option value="general">General Authentication</option>
                  <option value="election">Election Results Access</option>
                </select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="key-role" className="col-span-4">
                  Key Authorization Level
                </Label>
                <select
                  id="key-role"
                  value={keyRole}
                  onChange={(e) => setKeyRole(e.target.value as 'admin' | 'superadmin')}
                  className="col-span-4 w-full p-2 border rounded-md"
                >
                  <option value="admin">Admin</option>
                  <option value="superadmin">Superadmin</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddKeyDialogOpen(false)} disabled={isRegistering}>
                Cancel
              </Button>
              <Button onClick={handleAddPasskey} disabled={isRegistering}>
                {isRegistering ? "Registering..." : "Register Security Key"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {passkeys.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8 text-center">
            <Key className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium">No Security Keys Registered</h3>
            <p className="text-sm text-muted-foreground max-w-md mt-2">
              No security keys have been registered yet. Security keys provide standalone access to the system without requiring a specific user account.
            </p>
            <Button onClick={() => setIsAddKeyDialogOpen(true)} className="mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Register Security Key
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Registered Security Keys</CardTitle>
            <CardDescription>
              Security keys that can be used for system authentication
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {passkeys.map((key) => (
                <div key={key.id} className="flex items-center justify-between p-4 border rounded-md">
                  <div className="flex items-center">
                    <div className="p-2 bg-primary/10 rounded-md mr-3">
                      <Key className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{key.deviceName || 'Unnamed Device'}</div>
                      <div className="text-sm text-muted-foreground">
                        {key.purpose === 'election' ? 'Election Access' : 'General Access'} • 
                        {key.role === 'superadmin' ? ' Superadmin' : ' Admin'} •
                        Registered on {new Date(key.createdAt?.seconds * 1000).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setSelectedKeyId(key.id)}
                      >
                        <Trash className="h-4 w-4 text-red-500" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remove Security Key</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to remove this security key? You will need to register it again to use it.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setSelectedKeyId(null)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeletePasskey} className="bg-red-500 hover:bg-red-600">
                          Remove
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SecurityKeyManagement;
