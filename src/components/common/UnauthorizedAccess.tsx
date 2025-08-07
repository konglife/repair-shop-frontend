'use client';

import React from 'react';
import { Box, Typography, Button, Card, CardContent, Alert } from '@mui/material';
import { Lock, Home, Login } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { RouteAccessError } from '@/lib/route-protection';

interface UnauthorizedAccessProps {
  error: RouteAccessError;
  showActions?: boolean;
}

export default function UnauthorizedAccess({ error, showActions = true }: UnauthorizedAccessProps) {
  const router = useRouter();

  const handleGoHome = () => {
    router.push('/');
  };

  const handleGoLogin = () => {
    router.push('/login');
  };

  const getIcon = () => {
    switch (error.type) {
      case 'unauthorized':
        return <Login sx={{ fontSize: 64, color: 'warning.main' }} />;
      case 'forbidden':
        return <Lock sx={{ fontSize: 64, color: 'error.main' }} />;
      case 'token_expired':
        return <Login sx={{ fontSize: 64, color: 'warning.main' }} />;
      default:
        return <Lock sx={{ fontSize: 64, color: 'error.main' }} />;
    }
  };

  const getAlertSeverity = () => {
    switch (error.type) {
      case 'unauthorized':
      case 'token_expired':
        return 'warning';
      case 'forbidden':
        return 'error';
      default:
        return 'error';
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        p: 3,
      }}
    >
      <Card sx={{ maxWidth: 500, width: '100%' }}>
        <CardContent sx={{ textAlign: 'center', p: 4 }}>
          <Box sx={{ mb: 3 }}>
            {getIcon()}
          </Box>

          <Typography variant="h4" component="h1" gutterBottom>
            Access Denied
          </Typography>

          <Alert severity={getAlertSeverity()} sx={{ mb: 3, textAlign: 'left' }}>
            {error.message}
          </Alert>

          {error.type === 'unauthorized' && (
            <Typography variant="body2" color="text.secondary" paragraph>
              Please log in with your credentials to access this page.
            </Typography>
          )}

          {error.type === 'forbidden' && (
            <Typography variant="body2" color="text.secondary" paragraph>
              You don&apos;t have the necessary permissions to view this content. 
              Contact your administrator if you believe this is an error.
            </Typography>
          )}

          {error.type === 'token_expired' && (
            <Typography variant="body2" color="text.secondary" paragraph>
              Your session has expired. Please log in again to continue.
            </Typography>
          )}

          {showActions && (
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 3 }}>
              {(error.type === 'unauthorized' || error.type === 'token_expired') && (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Login />}
                  onClick={handleGoLogin}
                >
                  Login
                </Button>
              )}
              
              <Button
                variant="outlined"
                startIcon={<Home />}
                onClick={handleGoHome}
              >
                Go to Dashboard
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}