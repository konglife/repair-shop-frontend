'use client';

import React, { useState } from 'react';
import {
  AppBar,
  Box,
  CircularProgress,
  CssBaseline,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Button,
  Toolbar,
  Typography,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  Inventory,
  ShoppingCart,
  Build,
  PointOfSale,
  ShoppingBag,
  AccountCircle,
  Logout,
} from '@mui/icons-material';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import Breadcrumbs from '@/components/common/Breadcrumbs';

const drawerWidth = 240;
const collapsedDrawerWidth = 64;

interface NavigationItem {
  label: string;
  href: string;
  icon: React.ReactElement;
}

interface MainLayoutProps {
  children: React.ReactNode;
}

const navigationItems: NavigationItem[] = [
  { label: 'Dashboard', href: '/', icon: <Dashboard /> },
  { label: 'Products', href: '/products', icon: <Inventory /> },
  { label: 'Stock', href: '/stock', icon: <ShoppingCart /> },
  { label: 'Sales', href: '/sales', icon: <PointOfSale /> },
  { label: 'Repairs', href: '/repairs', icon: <Build /> },
  { label: 'Purchases', href: '/purchases', icon: <ShoppingBag /> },
];

export default function MainLayout({ children }: MainLayoutProps) {
  const theme = useTheme();
  const { user, logout, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(true);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleDesktopToggle = () => {
    setDesktopOpen(!desktopOpen);
  };

  const handleLogoutClick = () => {
    setLogoutDialogOpen(true);
  };

  const handleLogoutConfirm = async () => {
    setLoggingOut(true);
    try {
      logout(); // This will redirect to login page
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setLoggingOut(false);
      setLogoutDialogOpen(false);
    }
  };

  const handleLogoutCancel = () => {
    setLogoutDialogOpen(false);
  };

  const currentDrawerWidth = desktopOpen ? drawerWidth : collapsedDrawerWidth;

  const drawer = (isCollapsed: boolean = false) => (
    <Box>
      <Toolbar />
      <List>
        {navigationItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton
              component={Link}
              href={item.href}
              sx={{
                minHeight: 48,
                justifyContent: isCollapsed ? 'center' : 'initial',
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: isCollapsed ? 0 : 3,
                  justifyContent: 'center',
                }}
              >
                {item.icon}
              </ListItemIcon>
              {!isCollapsed && <ListItemText primary={item.label} />}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: '100%',
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Repair Shop Dashboard
          </Typography>
          <IconButton
            color="inherit"
            aria-label="toggle navigation drawer"
            onClick={handleDesktopToggle}
            sx={{ ml: 1, display: { xs: 'none', md: 'block' } }}
          >
            <MenuIcon />
          </IconButton>
          <IconButton
            color="inherit"
            aria-label="open navigation drawer"
            onClick={handleDrawerToggle}
            sx={{ ml: 1, display: { xs: 'block', md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton color="inherit" size="large">
              <AccountCircle />
            </IconButton>
            <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
              {loading ? 'Loading...' : user?.username || user?.email || 'User'}
            </Typography>
            <IconButton 
              color="inherit" 
              title="Logout" 
              onClick={handleLogoutClick}
              disabled={loading || loggingOut}
            >
              {loggingOut ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                <Logout />
              )}
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: drawerWidth,
            top: { xs: 56, sm: 64 }, // Account for mobile/desktop AppBar height
            height: { xs: 'calc(100% - 56px)', sm: 'calc(100% - 64px)' },
          },
        }}
      >
        {drawer(false)}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: currentDrawerWidth,
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            overflowX: 'hidden',
          },
        }}
        open
      >
        {drawer(!desktopOpen)}
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          ml: { xs: 0, md: `${currentDrawerWidth}px` },
          transition: theme.transitions.create(['margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar />
        <Breadcrumbs />
        {children}
      </Box>
      
      {/* Logout Confirmation Dialog */}
      <Dialog
        open={logoutDialogOpen}
        onClose={handleLogoutCancel}
        aria-labelledby="logout-dialog-title"
        aria-describedby="logout-dialog-description"
      >
        <DialogTitle id="logout-dialog-title">
          Confirm Logout
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="logout-dialog-description">
            Are you sure you want to log out? You will need to log in again to access the dashboard.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLogoutCancel} disabled={loggingOut}>
            Cancel
          </Button>
          <Button 
            onClick={handleLogoutConfirm} 
            variant="contained" 
            color="primary"
            disabled={loggingOut}
          >
            {loggingOut ? (
              <>
                <CircularProgress size={16} sx={{ mr: 1 }} />
                Logging out...
              </>
            ) : (
              'Logout'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}