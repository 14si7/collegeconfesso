import { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useAuth } from '@/lib/auth';
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Link } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { User } from 'lucide-react';

const LOGIN_USER = gql`
  mutation Login($username: String!, $secretCode: String!) {
    login(username: $username, secretCode: $secretCode) {
      token
      user {
        id
        username
      }
    }
  }
`;

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  secretCode: z.string().min(1, 'Secret code is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const { toast } = useToast();
  const [error, setError] = useState('');

  const [loginUser, { loading }] = useMutation(LOGIN_USER);

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      secretCode: '',
    },
  });

  const onSubmit = async (data: LoginForm) => {
    setError('');
    try {
      const { data: result } = await loginUser({
        variables: data,
      });

      login(result.login.token, result.login.user);
      toast({
        title: "Success",
        description: "Login successful!",
      });
      setLocation('/');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <Card className="glass-card border-0 shadow-2xl">
          <CardHeader className="text-center pb-8">
            <div className="gradient-bg w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 float">
              <User className="h-10 w-10 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold gradient-text">Welcome Back</CardTitle>
            <CardDescription className="text-lg mt-2">
              Sign in to share your anonymous confessions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <Alert className="mb-6 border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive glass-card">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">Username</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Your anonymous username" 
                          className="h-12 text-lg glass-card border-0" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="secretCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">Secret Code</FormLabel>
                      <FormControl>
                        <Input 
                          type="password"
                          placeholder="Your secret access code" 
                          className="h-12 text-lg glass-card border-0"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full h-12 text-lg btn-hover glow gradient-bg border-0" 
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </Form>

            <div className="text-center text-muted-foreground">
              Don't have an account?{' '}
              <Link href="/register" className="text-primary hover:text-primary/80 font-semibold transition-colors">
                Create one here
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
