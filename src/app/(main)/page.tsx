'use client';

import React from 'react';
import { Box, Typography, Card, CardContent, CircularProgress } from '@mui/material';
import { useAuthGuard, useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const { loading, isProtected } = useAuthGuard();
  const { user } = useAuth();

  // Show loading while authenticating or redirecting
  if (loading || isProtected) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome to Repair Shop Dashboard
      </Typography>
      
      <Typography variant="h6" color="text.secondary" gutterBottom>
        Hello, {user?.username || user?.email}!
      </Typography>

      <Box 
        sx={{ 
          display: 'grid',
          gridTemplateColumns: { 
            xs: '1fr', 
            md: 'repeat(2, 1fr)', 
            lg: 'repeat(4, 1fr)' 
          },
          gap: 3,
          mt: 2 
        }}
      >
        <Card>
          <CardContent>
            <Typography variant="h6" component="div">
              Products
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage your inventory
            </Typography>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent>
            <Typography variant="h6" component="div">
              Stock
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Track stock levels
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" component="div">
              Sales
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Record sales transactions
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" component="div">
              Repairs
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage repair jobs
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
