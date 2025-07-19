import { useState, useEffect } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const CREATE_CONFESSION = gql`
  mutation CreateConfession($content: String!) {
    createConfession(content: $content) {
      id
      content
      user { 
        username 
      }
      createdAt
    }
  }
`;

const UPDATE_CONFESSION = gql`
  mutation UpdateConfession($id: ID!, $content: String!) {
    updateConfession(id: $id, content: $content) {
      id
      content
    }
  }
`;

const confessionSchema = z.object({
  content: z.string()
    .min(10, 'Confession must be at least 10 characters')
    .max(1000, 'Confession must be less than 1000 characters'),
});

type ConfessionForm = z.infer<typeof confessionSchema>;

interface Confession {
  id: string;
  content: string;
  user: {
    username: string;
  };
  createdAt: string;
}

interface ConfessionFormProps {
  confession?: Confession | null;
  onSuccess: () => void;
  onCancel?: () => void;
}

export default function ConfessionForm({ confession, onSuccess, onCancel }: ConfessionFormProps) {
  const { toast } = useToast();
  const [createConfession, { loading: creating }] = useMutation(CREATE_CONFESSION);
  const [updateConfession, { loading: updating }] = useMutation(UPDATE_CONFESSION);
  
  const isEditing = !!confession;
  const loading = creating || updating;

  const form = useForm<ConfessionForm>({
    resolver: zodResolver(confessionSchema),
    defaultValues: {
      content: '',
    },
  });

  useEffect(() => {
    if (confession) {
      form.reset({ content: confession.content });
    } else {
      form.reset({ content: '' });
    }
  }, [confession, form]);

  const onSubmit = async (data: ConfessionForm) => {
    try {
      if (isEditing) {
        await updateConfession({
          variables: {
            id: confession.id,
            content: data.content,
          },
        });
        
        toast({
          title: "Success",
          description: "Confession updated successfully!",
        });
      } else {
        await createConfession({
          variables: data,
        });
        
        toast({
          title: "Success",
          description: "Confession shared successfully!",
        });
        
        form.reset();
      }
      
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || `Failed to ${isEditing ? 'update' : 'create'} confession`,
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>
          {isEditing ? 'Edit Confession' : 'Share Your Truth'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="What's on your mind? Share your truth anonymously..."
                      className="resize-none"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {form.watch('content')?.length || 0}/1000 characters
              </span>
              <div className="flex space-x-3">
                {isEditing && onCancel && (
                  <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                  </Button>
                )}
                <Button type="submit" disabled={loading}>
                  {loading ? (isEditing ? 'Updating...' : 'Sharing...') : (isEditing ? 'Update' : 'Share Confession')}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
