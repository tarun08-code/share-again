import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { Chrome } from 'lucide-react';

interface GoogleAuthButtonProps {
  mode: 'login' | 'register';
  onSuccess?: () => void;
}

export default function GoogleAuthButton({ mode, onSuccess }: GoogleAuthButtonProps) {
  const { loginWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleGoogleAuth = async () => {
    if (!loginWithGoogle) return;
    
    setLoading(true);
    try {
      const success = await loginWithGoogle();
      if (success && onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Google auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleGoogleAuth}
      disabled={loading}
      className="w-full flex items-center justify-center space-x-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
    >
      <Chrome className="h-5 w-5 text-blue-500" />
      <span className="text-gray-700 dark:text-gray-300">
        {loading ? 'Connecting...' : `${mode === 'login' ? 'Sign in' : 'Sign up'} with Google`}
      </span>
    </Button>
  );
}