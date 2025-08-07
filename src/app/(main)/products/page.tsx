'use client';

import React from 'react';
import { Box, Typography, Card, CardContent, Button, Grid } from '@mui/material';
import { Add, Inventory2 } from '@mui/icons-material';

export default function ProductsPage() {

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Products
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          sx={{ minWidth: 140 }}
        >
          Add Product
        </Button>
      </Box>

      <Typography variant="body1" color="text.secondary" gutterBottom>
        Manage your inventory of products and services.
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Inventory2 sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" component="div" gutterBottom>
                Product Catalog
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Browse and manage your complete product inventory with pricing and specifications.
              </Typography>
              <Button variant="outlined" fullWidth>
                View Catalog
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Add sx={{ fontSize: 64, color: 'secondary.main', mb: 2 }} />
              <Typography variant="h6" component="div" gutterBottom>
                Add New Product
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Create new product entries with detailed information and pricing.
              </Typography>
              <Button variant="outlined" fullWidth>
                Create Product
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h2" component="div" sx={{ color: 'primary.main', mb: 1 }}>
                0
              </Typography>
              <Typography variant="h6" component="div" gutterBottom>
                Total Products
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Products currently in system
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}