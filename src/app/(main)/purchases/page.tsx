'use client';

import React from 'react';
import { Box, Typography, Card, CardContent, Button, Grid } from '@mui/material';
import { Add, ShoppingBag, Receipt, LocalShipping, TrendingUp } from '@mui/icons-material';

export default function PurchasesPage() {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Purchases
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          sx={{ minWidth: 160 }}
        >
          New Purchase Order
        </Button>
      </Box>

      <Typography variant="body1" color="text.secondary" gutterBottom>
        Record and manage purchase orders for inventory restocking.
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <ShoppingBag sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" component="div" sx={{ color: 'primary.main' }}>
                0
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active Purchase Orders
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <LocalShipping sx={{ fontSize: 48, color: 'info.main', mb: 1 }} />
              <Typography variant="h4" component="div" sx={{ color: 'info.main' }}>
                0
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pending Deliveries
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Receipt sx={{ fontSize: 48, color: 'success.main', mb: 1 }} />
              <Typography variant="h4" component="div" sx={{ color: 'success.main' }}>
                $0
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Monthly Spend
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <TrendingUp sx={{ fontSize: 48, color: 'warning.main', mb: 1 }} />
              <Typography variant="h4" component="div" sx={{ color: 'warning.main' }}>
                $0
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Value
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="div" gutterBottom>
                Recent Purchase Orders
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                No purchase orders yet. Create your first purchase order to get started.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}