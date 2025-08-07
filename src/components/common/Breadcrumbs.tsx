'use client';

import React from 'react';
import { Breadcrumbs as MUIBreadcrumbs, Link, Typography, Box } from '@mui/material';
import { NavigateNext, Home } from '@mui/icons-material';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactElement;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
}

const pathLabelMap: Record<string, string> = {
  '/': 'Dashboard',
  '/products': 'Products',
  '/stock': 'Stock Management', 
  '/sales': 'Sales',
  '/repairs': 'Repairs',
  '/purchases': 'Purchases',
};

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  const pathname = usePathname();

  // Auto-generate breadcrumbs if not provided
  const breadcrumbItems = items || generateBreadcrumbs(pathname);

  if (breadcrumbItems.length <= 1) {
    return null; // Don't show breadcrumbs for single level or empty
  }

  return (
    <Box sx={{ mb: 2 }}>
      <MUIBreadcrumbs
        separator={<NavigateNext fontSize="small" />}
        aria-label="breadcrumb"
      >
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;
          
          if (isLast || !item.href) {
            return (
              <Typography 
                key={item.label}
                color="text.primary" 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  fontWeight: isLast ? 600 : 400
                }}
              >
                {item.icon && <Box component="span" sx={{ mr: 0.5, display: 'flex' }}>{item.icon}</Box>}
                {item.label}
              </Typography>
            );
          }

          return (
            <Link
              key={item.label}
              component={NextLink}
              href={item.href}
              underline="hover"
              color="inherit"
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                '&:hover': {
                  color: 'primary.main'
                }
              }}
            >
              {item.icon && <Box component="span" sx={{ mr: 0.5, display: 'flex' }}>{item.icon}</Box>}
              {item.label}
            </Link>
          );
        })}
      </MUIBreadcrumbs>
    </Box>
  );
}

function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [];

  // Always start with Home/Dashboard
  breadcrumbs.push({
    label: 'Dashboard',
    href: '/',
    icon: <Home fontSize="small" />
  });

  // Build path incrementally
  let currentPath = '';
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const label = pathLabelMap[currentPath] || segment.charAt(0).toUpperCase() + segment.slice(1);
    
    breadcrumbs.push({
      label,
      href: index === segments.length - 1 ? undefined : currentPath // No href for current page
    });
  });

  return breadcrumbs;
}