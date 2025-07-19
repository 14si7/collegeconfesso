import { useEffect, useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle } from 'lucide-react';

const CONNECTION_TEST = gql`
  query {
    confessions {
      id
    }
  }
`;

export default function ConnectionStatus() {
  const { data, loading, error } = useQuery(CONNECTION_TEST, {
    errorPolicy: 'all',
  });
  
  const [status, setStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');

  useEffect(() => {
    if (loading) {
      setStatus('connecting');
    } else if (error) {
      setStatus('disconnected');
    } else if (data) {
      setStatus('connected');
    }
  }, [loading, error, data]);

  if (status === 'connecting') {
    return null; // Don't show anything while loading initially
  }

  if (status === 'disconnected') {
    return (
      <Alert className="mb-4 border-destructive/50 text-destructive">
        <XCircle className="h-4 w-4" />
        <AlertDescription>
          Unable to connect to GraphQL backend at localhost:4000/graphql. Please ensure your backend is running.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="mb-4 border-green-500/50 text-green-700 dark:text-green-400">
      <CheckCircle className="h-4 w-4" />
      <AlertDescription>
        Successfully connected to GraphQL backend. All features are available.
      </AlertDescription>
    </Alert>
  );
}