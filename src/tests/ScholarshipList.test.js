import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ScholarshipList from '../components/ScholarshipList';
import axios from 'axios';
import { BrowserRouter } from 'react-router-dom';

jest.mock('axios');

describe('ScholarshipList', () => {
  const scholarships = [
    { id: 1, name: 'Merit Scholarship', amount: 5000, deadline: '2024-08-01', isActive: true },
    { id: 2, name: 'Need Scholarship', amount: 2500, deadline: '2024-07-15', isActive: false },
  ];
  
  beforeEach(() => jest.clearAllMocks());

  it('renders all scholarships', async () => {
    axios.get.mockResolvedValueOnce({ data: scholarships });
    render(<BrowserRouter><ScholarshipList /></BrowserRouter>);
    await screen.findByText(/Merit Scholarship/);
    expect(screen.getByText(/Need Scholarship/)).toBeInTheDocument();
  });
  it('filters active scholarships', async () => {
    axios.get.mockResolvedValueOnce({ data: scholarships });
    render(<BrowserRouter><ScholarshipList /></BrowserRouter>);
    await screen.findByText(/Merit Scholarship/);
    axios.get.mockResolvedValueOnce({ data: [scholarships[0]] });
    fireEvent.click(screen.getByTestId('active-toggle'));
    await waitFor(() => {
      expect(screen.getByText(/Merit Scholarship/)).toBeInTheDocument();
      expect(screen.queryByText(/Need Scholarship/)).not.toBeInTheDocument();
    });
  });
  it('shows empty state if no scholarships', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });
    render(<BrowserRouter><ScholarshipList /></BrowserRouter>);
    await screen.findByText(/No scholarships found/);
    expect(screen.getByText(/No scholarships found/)).toBeInTheDocument();
  });
});
