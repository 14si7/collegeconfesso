import { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useAuth } from '@/lib/auth';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreVertical, MessageCircle, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const DELETE_CONFESSION = gql`
  mutation DeleteConfession($id: ID!) {
    deleteConfession(id: $id)
  }
`;

interface Confession {
  id: string;
  content: string;
  user: {
    username: string;
  };
  createdAt: string;
}

interface ConfessionCardProps {
  confession: Confession;
  onEdit: (confession: Confession) => void;
  onShowComments: (confessionId: string) => void;
  onUpdate: () => void;
}

export default function ConfessionCard({ confession, onEdit, onShowComments, onUpdate }: ConfessionCardProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [deleteConfession] = useMutation(DELETE_CONFESSION);
  
  const isOwner = user && confession.user.username === user.username;

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this confession?')) {
      return;
    }

    try {
      await deleteConfession({
        variables: { id: confession.id },
      });
      
      toast({
        title: "Success",
        description: "Confession deleted successfully!",
      });
      
      onUpdate();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete confession",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="mb-6 glass-card card-hover border-0 shadow-xl">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <div className="w-12 h-12 gradient-bg rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">
                {confession.user.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="ml-4">
              <p className="font-semibold text-foreground text-base">@{confession.user.username}</p>
              <p className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(parseInt(confession.createdAt)), { addSuffix: true })}
              </p>
            </div>
          </div>
          
          {isOwner && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-10 w-10 p-0 btn-hover rounded-full">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass-card">
                <DropdownMenuItem onClick={() => onEdit(confession)} className="cursor-pointer">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Confession
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete} className="cursor-pointer text-destructive focus:text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Confession
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <div className="mb-6">
          <p className="text-foreground leading-relaxed text-lg font-medium">{confession.content}</p>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onShowComments(confession.id)}
            className="btn-hover text-muted-foreground hover:text-primary transition-colors font-medium"
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            View Comments
          </Button>
          <div className="text-xs text-muted-foreground opacity-60">
            {new Date(parseInt(confession.createdAt)).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
