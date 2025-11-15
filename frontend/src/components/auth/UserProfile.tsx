import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { LogOut, User as UserIcon, Mail, UserCog } from 'lucide-react';
import { toast } from 'react-hot-toast';

const UserProfile = () => {
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<{
    full_name?: string;
    avatar_url?: string;
    updated_at?: string;
  } | null>(null);

  useEffect(() => {
    if (user) {
      getProfile();
    }
  }, [user]);

  const getProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) {
        throw error;
      }

      setProfile(data);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Successfully signed out');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600">Please sign in to view your profile</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-6">
      <div className="flex flex-col items-center mb-6">
        <div className="relative w-24 h-24 mb-4">
          {profile?.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.full_name || 'User'}
              className="w-full h-full rounded-full object-cover border-2 border-gray-200"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
              <UserCog className="w-12 h-12 text-gray-400" />
            </div>
          )}
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800">
          {profile?.full_name || 'User'}
        </h2>
        <p className="text-gray-600 flex items-center mt-1">
          <Mail className="w-4 h-4 mr-2" />
          {user.email}
        </p>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Account Details</h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Account Created</p>
            <p className="text-gray-800">
              {new Date(user.created_at).toLocaleDateString()}
            </p>
          </div>
          {profile?.updated_at && (
            <div>
              <p className="text-sm text-gray-500">Last Updated</p>
              <p className="text-gray-800">
                {new Date(profile.updated_at).toLocaleString()}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSignOut}
          className="flex items-center px-4 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
