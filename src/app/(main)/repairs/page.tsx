'use client';

import React from 'react';
import { Box, Typography, Card, CardContent, Button, Grid, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import { Add, Build, Schedule, CheckCircle, Error } from '@mui/icons-material';

export default function RepairsPage() {

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Repairs
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          sx={{ minWidth: 140 }}
        >
          New Repair Job
        </Button>
      </Box>

      <Typography variant="body1" color="text.secondary" gutterBottom>
        Manage repair jobs, track progress, and maintain service records.
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid size={{ xs: 12, md: 3 }}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Schedule sx={{ fontSize: 48, color: 'warning.main', mb: 1 }} />
              <Typography variant="h4" component="div" sx={{ color: 'warning.main' }}>
                0
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pending Repairs
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Build sx={{ fontSize: 48, color: 'info.main', mb: 1 }} />
              <Typography variant="h4" component="div" sx={{ color: 'info.main' }}>
                0
              </Typography>
              <Typography variant="body2" color="text.secondary">
                In Progress
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <CheckCircle sx={{ fontSize: 48, color: 'success.main', mb: 1 }} />
              <Typography variant="h4" component="div" sx={{ color: 'success.main' }}>
                0
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Completed
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Error sx={{ fontSize: 48, color: 'error.main', mb: 1 }} />
              <Typography variant="h4" component="div" sx={{ color: 'error.main' }}>
                0
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Issues
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="div" gutterBottom>
                Active Repair Jobs
              </Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Job ID</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Device/Item</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Priority</TableCell>
                    <TableCell>Due Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                      No active repair jobs. Create your first repair job to get started.
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