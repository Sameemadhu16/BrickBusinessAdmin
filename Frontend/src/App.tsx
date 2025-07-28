import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import ItemsPage from './pages/Items/ItemsPage';
import AddSalePage from './pages/Sales/AddSalePage';
import SalesRecordsPage from './pages/Sales/SalesRecordsPage';
import ReportsPage from './pages/Reports/ReportsPage';
import TransportTrackerPage from './pages/Transport/TransportTrackerPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/items" element={<ItemsPage />} />
              <Route path="/sales/add" element={<AddSalePage />} />
              <Route path="/sales/records" element={<SalesRecordsPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/transport" element={<TransportTrackerPage />} />
            </Routes>
          </Layout>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
