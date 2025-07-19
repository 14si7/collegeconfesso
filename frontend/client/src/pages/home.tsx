import { useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import { useAuth } from '@/lib/auth';
import ConfessionCard from '@/components/confession-card';
import ConfessionForm from '@/components/confession-form';
import CommentsModal from '@/components/comments-modal';
import ConnectionStatus from '@/components/connection-status';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { MessageCircle } from 'lucide-react';

const GET_CONFESSIONS = gql`
  query {
    confessions {
      id
      content
      user { 
        username 
      }
      createdAt
    }
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

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [editingConfession, setEditingConfession] = useState<Confession | null>(null);
  const [showComments, setShowComments] = useState<string | null>(null);
  
  const { data, loading, error, refetch } = useQuery(GET_CONFESSIONS, {
    pollInterval: 30000, // Refresh every 30 seconds
  });

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-2 text-muted-foreground">Loading confessions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="text-destructive mb-2 text-2xl">⚠️</div>
          <p className="text-muted-foreground mb-4">Failed to load confessions</p>
          <Button onClick={() => refetch()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Connection Status */}
        <ConnectionStatus />
        
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold gradient-text mb-4 float">
            Anonymous Confessions
          </h1>
          <p className="text-muted-foreground text-xl mb-8 opacity-80">
            Share your truth in a safe, anonymous space
          </p>
        </div>

        {/* Confession Form */}
      {isAuthenticated && (
        <ConfessionForm
          confession={editingConfession}
          onSuccess={() => {
            setEditingConfession(null);
            refetch();
          }}
          onCancel={() => setEditingConfession(null)}
        />
      )}

      {/* Sign in prompt for anonymous users */}
      {!isAuthenticated && (
        <div className="glass-card rounded-2xl p-8 mb-8 text-center card-hover">
          <div className="gradient-bg w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-3">Share Your Story</h3>
          <p className="text-muted-foreground mb-6 text-lg">Sign in to share your confessions anonymously and connect with others</p>
          <div className="flex gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" className="btn-hover glow">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline" className="btn-hover">Create Account</Button>
            </Link>
          </div>
        </div>
      )}

      {/* Confessions List */}
      <div className="space-y-6">
        {data?.confessions?.length === 0 ? (
          <div className="text-center py-16 glass-card rounded-2xl">
            <div className="w-24 h-24 gradient-bg rounded-full flex items-center justify-center mx-auto mb-6 float">
              <MessageCircle className="h-12 w-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold gradient-text mb-4">No Confessions Yet</h3>
            <p className="text-muted-foreground text-lg mb-2">This is where heartfelt stories come to life</p>
            <p className="text-muted-foreground opacity-75">Be the first to share your truth</p>
          </div>
        ) : (
          data?.confessions?.map((confession: Confession) => (
            <ConfessionCard
              key={confession.id}
              confession={confession}
              onEdit={setEditingConfession}
              onShowComments={setShowComments}
              onUpdate={() => refetch()}
            />
          ))
        )}
      </div>

      {/* Comments Modal */}
      {showComments && (
        <CommentsModal
          confessionId={showComments}
          onClose={() => setShowComments(null)}
        />
      )}
      </div>
    </div>
  );
}
