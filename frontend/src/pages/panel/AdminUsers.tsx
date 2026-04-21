import { useEffect, useState } from 'react';
import { Shield, User, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface UserData {
  _id: string;
  fullname: string;
  email: string;
  role: 'admin' | 'user';
  reservationCount?: number;
}

interface Message {
  type: '' | 'success' | 'error';
  text: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<Message>({ type: '', text: '' });

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/users`, {
        credentials: 'include'
      });
      const data: { users: UserData[] } = await res.json();
      setUsers(data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
      setMessage({ type: 'error', text: 'Failed to load users' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchUsers();
    };
    loadData();
  }, []);

  const handlePromote = async (userId: string) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/users/${userId}/promote`, {
        method: 'PUT',
        credentials: 'include'
      });
      const data: { message: string } = await res.json();
      
      if (res.ok) {
        setMessage({ type: 'success', text: 'User promoted to admin!' });
        fetchUsers();
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        setMessage({ type: 'error', text: data.message });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      }
    } catch (error) {
      console.error('Error promoting user:', error);
      setMessage({ type: 'error', text: 'Failed to promote user' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const handleDemote = async (userId: string) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/users/${userId}/demote`, {
        method: 'PUT',
        credentials: 'include'
      });
      const data: { message: string } = await res.json();
      
      if (res.ok) {
        setMessage({ type: 'success', text: 'Admin demoted to user!' });
        fetchUsers();
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        setMessage({ type: 'error', text: data.message });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      }
    } catch (error) {
      console.error('Error demoting user:', error);
      setMessage({ type: 'error', text: 'Failed to demote user' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This will also delete all their reservations.')) {
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/users/${userId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      const data: { message: string } = await res.json();
      
      if (res.ok) {
        setMessage({ type: 'success', text: 'User deleted successfully!' });
        fetchUsers();
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        setMessage({ type: 'error', text: data.message });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      setMessage({ type: 'error', text: 'Failed to delete user' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-slate-400 text-xl">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-100 mb-2">User Management</h1>
        <p className="text-slate-400">Manage users and admin permissions</p>
      </div>

      {/* Message Alert */}
      {message.text && (
        <Alert variant={message.type === 'error' ? 'destructive' : 'default'}
               className={message.type === 'success' ? 'bg-green-900/20 border-green-700 text-green-400' : ''}>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4">
            <p className="text-slate-400 text-sm mb-1">Total Users</p>
            <p className="text-2xl font-bold text-slate-100">{users.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4">
            <p className="text-slate-400 text-sm mb-1">Admins</p>
            <p className="text-2xl font-bold text-purple-400">
              {users.filter(u => u.role === 'admin').length}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4">
            <p className="text-slate-400 text-sm mb-1">Regular Users</p>
            <p className="text-2xl font-bold text-blue-400">
              {users.filter(u => u.role === 'user').length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-slate-100">All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">User</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Email</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Role</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Reservations</th>
                  <th className="text-right py-3 px-4 text-slate-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          user.role === 'admin' 
                            ? 'bg-gradient-to-br from-purple-500 to-pink-600' 
                            : 'bg-gradient-to-br from-blue-500 to-cyan-600'
                        }`}>
                          {user.role === 'admin' ? (
                            <Shield className="w-5 h-5 text-white" />
                          ) : (
                            <User className="w-5 h-5 text-white" />
                          )}
                        </div>
                        <div>
                          <p className="text-slate-100 font-medium">{user.fullname}</p>
                          <p className="text-slate-500 text-xs">ID: {user._id.slice(-6)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-300">{user.email}</td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        user.role === 'admin'
                          ? 'bg-purple-900/30 text-purple-400 border border-purple-700'
                          : 'bg-blue-900/30 text-blue-400 border border-blue-700'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-300">{user.reservationCount || 0}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end gap-2">
                        {user.role === 'user' ? (
                          <Button
                            onClick={() => handlePromote(user._id)}
                            size="sm"
                            className="bg-purple-600 hover:bg-purple-700 text-white"
                          >
                            <ChevronUp className="w-4 h-4 mr-1" />
                            Promote
                          </Button>
                        ) : (
                          <Button
                            onClick={() => handleDemote(user._id)}
                            size="sm"
                            variant="outline"
                            className="border-slate-600 text-slate-300 hover:bg-slate-800"
                          >
                            <ChevronDown className="w-4 h-4 mr-1" />
                            Demote
                          </Button>
                        )}
                        <Button
                          onClick={() => handleDelete(user._id)}
                          size="sm"
                          variant="destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}