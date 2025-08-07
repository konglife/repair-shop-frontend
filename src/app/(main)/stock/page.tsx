'use client';

import React from 'react';
import { Box, Typography, Card, CardContent, Button, Grid, Chip } from '@mui/material';
import { Add, Inventory, Warning, TrendingUp } from '@mui/icons-material';

export default function StockPage() {

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Stock Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          sx={{ minWidth: 140 }}
        >
          Stock Update
        </Button>
      </Box>

      <Typography variant="body1" color="text.secondary" gutterBottom>
        Monitor and manage stock levels across all products and locations.
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Inventory sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" component="div" sx={{ color: 'primary.main' }}>
                0
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Items in Stock
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Warning sx={{ fontSize: 48, color: 'warning.main', mb: 1 }} />
              <Typography variant="h4" component="div" sx={{ color: 'warning.main' }}>
                0
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Low Stock Alerts
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <TrendingUp sx={{ fontSize: 48, color: 'success.main', mb: 1 }} />
              <Typography variant="h4" component="div" sx={{ color: 'success.main' }}>
                0
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Stock Movements Today
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" component="div" sx={{ color: 'text.primary', mb: 1 }}>
                $0
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Stock Value
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" component="div">
                  Stock Overview
                </Typography>
                <Chip 
                  label="All items in stock" 
                  color="success" 
                  variant="outlined" 
                />
              </Box>
              <Typography variant="body2" color="text.secondary">
                No stock issues detected. All products are adequately stocked.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}