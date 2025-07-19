import { useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'wouter';

const GET_COMMENTS = gql`
  query GetComments($confessionId: String!) {
    comments(confessionId: $confessionId) {
      id
      content
      createdAt
      user {
        id
        username
      }
    }
  }
`;

const CREATE_COMMENT = gql`
  mutation CreateComment($confessionId: String!, $content: String!) {
    createComment(confessionId: $confessionId, content: $content) {
      id
      content
      createdAt
      user {
        id
        username
      }
    }
  }
`;

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    username: string;
  };
}

interface CommentsModalProps {
  confessionId: string;
  onClose: () => void;
}

export default function CommentsModal({ confessionId, onClose }: CommentsModalProps) {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [newComment, setNewComment] = useState('');
  
  const { data, loading, refetch } = useQuery(GET_COMMENTS, {
    variables: { confessionId },
  });
  
  const [createComment, { loading: submitting }] = useMutation(CREATE_COMMENT);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await createComment({
        variables: {
          confessionId,
          content: newComment,
        },
      });
      
      setNewComment('');
      refetch();
      
      toast({
        title: "Success",
        description: "Comment added successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add comment",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Comments</DialogTitle>
          <DialogDescription>
            View and add comments for this confession
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading comments...</div>
          ) : data?.comments?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No comments yet. Be the first to comment!
            </div>
          ) : (
            <div className="space-y-4">
              {data?.comments?.map((comment: Comment) => (
                <div key={comment.id} className="flex space-x-3">
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-muted-foreground font-medium text-xs">
                      {comment.user.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-sm text-foreground">
                        {comment.user.username}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(parseInt(comment.createdAt)).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="text-foreground text-sm mt-1">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {isAuthenticated ? (
          <>
            <Separator />
            <form onSubmit={handleSubmitComment} className="flex space-x-3 pt-4">
              <Input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1"
              />
              <Button
                type="submit"
                disabled={!newComment.trim() || submitting}
              >
                {submitting ? 'Posting...' : 'Post'}
              </Button>
            </form>
          </>
        ) : (
          <>
            <Separator />
            <div className="text-center pt-4">
              <p className="text-muted-foreground mb-4">Sign in to add comments</p>
              <Link href="/login">
                <Button onClick={onClose}>Sign In</Button>
              </Link>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
