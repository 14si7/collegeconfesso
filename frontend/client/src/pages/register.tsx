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
import { UserPlus } from 'lucide-react';

const REGISTER_USER = gql`
  mutation Register($username: String!, $secretCode: String!) {
    register(username: $username, secretCode: $secretCode) {
      token
      user {
        id
        username
      }
    }
  }
`;

const registerSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters'),
  secretCode: z.string()
    .min(6, 'Secret code must be at least 6 characters'),
  confirmSecretCode: z.string(),
}).refine(data => data.secretCode === data.confirmSecretCode, {
  message: "Secret codes don't match",
  path: ["confirmSecretCode"],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function Register() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const { toast } = useToast();
  const [error, setError] = useState('');

  const [registerUser, { loading }] = useMutation(REGISTER_USER);

  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      secretCode: '',
      confirmSecretCode: '',
    },
  });

  const onSubmit = async (data: RegisterForm) => {
    setError('');
    try {
      const { data: result } = await registerUser({
        variables: {
          username: data.username,
          secretCode: data.secretCode,
        },
      });

      login(result.register.token, result.register.user);
      toast({
        title: "Success",
        description: "Registration successful! Welcome to Confessions.",
      });
      setLocation('/');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <Card className="glass-card border-0 shadow-2xl">
          <CardHeader className="text-center pb-8">
            <div className="gradient-bg w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 float">
              <UserPlus className="h-10 w-10 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold gradient-text">Join Us</CardTitle>
            <CardDescription className="text-lg mt-2">
              Create your anonymous account to share confessions
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
                          placeholder="Choose your anonymous username" 
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
                          placeholder="Create your secret access code (min 6 characters)" 
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
                  name="confirmSecretCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">Confirm Secret Code</FormLabel>
                      <FormControl>
                        <Input 
                          type="password"
                          placeholder="Confirm your secret code" 
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
                  {loading ? "Creating account..." : "Create Account"}
                </Button>
              </form>
            </Form>

            <div className="text-center text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="text-primary hover:text-primary/80 font-semibold transition-colors">
                Sign in here
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
