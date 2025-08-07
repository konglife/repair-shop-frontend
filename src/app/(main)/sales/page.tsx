'use client';

import React from 'react';
import { Box, Typography, Card, CardContent, Button, Grid, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import { Add, PointOfSale, AttachMoney, Receipt } from '@mui/icons-material';

export default function SalesPage() {

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Sales
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          sx={{ minWidth: 140 }}
        >
          New Sale
        </Button>
      </Box>

      <Typography variant="body1" color="text.secondary" gutterBottom>
        Record and track sales transactions and revenue.
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <AttachMoney sx={{ fontSize: 48, color: 'success.main', mb: 1 }} />
              <Typography variant="h4" component="div" sx={{ color: 'success.main' }}>
                $0
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Today&apos;s Sales
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Receipt sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" component="div" sx={{ color: 'primary.main' }}>
                0
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Transactions Today
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <PointOfSale sx={{ fontSize: 48, color: 'info.main', mb: 1 }} />
              <Typography variant="h4" component="div" sx={{ color: 'info.main' }}>
                $0
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Average Sale Value
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="div" gutterBottom>
                Recent Sales
              </Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Transaction ID</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                      No sales recorded yet. Create your first sale transaction.
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}