import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ApplicationList from '../components/ApplicationList';
import axios from 'axios';
import { BrowserRouter } from 'react-router-dom';

jest.mock('axios');

describe('ApplicationList', () => {
  const applications = [
    { id: 1, status: 'PENDING', applicationDate: '2024-07-20',
      student: { id: 2, name: 'John Doe', department: 'CS', yearOfStudy: 2, cgpa: 8.5, email: 'john@x.com' },
      scholarship: { id: 3, name: 'Merit Scholarship', amount: 5000, deadline: '2024-09-01' }
    },
    { id: 4, status: 'APPROVED', applicationDate: '2024-07-21',
      student: { id: 5, name: 'Alice A', department: 'Math', yearOfStudy: 3, cgpa: 8, email: 'alice@x.com' },
      scholarship: { id: 6, name: 'Need Scholarship', amount: 2500, deadline: '2024-10-01' }
    },
  ];
  beforeEach(() => jest.clearAllMocks());

  it('renders all applications', async () => {
    axios.get.mockResolvedValueOnce({ data: applications });
    render(<BrowserRouter><ApplicationList /></BrowserRouter>);
    await screen.findByText(/John Doe applying for Merit Scholarship/);
    expect(screen.getByText(/Alice A applying for Need Scholarship/)).toBeInTheDocument();
  });
  it('filters by status', async () => {
    axios.get.mockResolvedValueOnce({ data: applications });
    render(<BrowserRouter><ApplicationList /></BrowserRouter>);
    await screen.findByText(/John Doe applying for Merit Scholarship/);
    // simulate filter to APPROVED
    axios.get.mockResolvedValueOnce({ data: [applications[1]] });
    fireEvent.change(screen.getByTestId('status-filter'), { target: { value: 'APPROVED' } });
    await waitFor(() => {
      expect(screen.getByText(/Alice A applying for Need Scholarship/)).toBeInTheDocument();
      expect(screen.queryByText(/John Doe applying for Merit Scholarship/)).not.toBeInTheDocument();
    });
  });
  it('shows empty state if no applications', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });
    render(<BrowserRouter><ApplicationList /></BrowserRouter>);
    await screen.findByText(/No applications found/);
    expect(screen.getByText(/No applications found/)).toBeInTheDocument();
  });
});
