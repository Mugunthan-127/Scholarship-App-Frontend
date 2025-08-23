import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ApplicationDetail from '../components/ApplicationDetail';
import axios from 'axios';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

jest.mock('axios');

describe('ApplicationDetail', () => {
  const application = {
    id: 1,
    status: 'PENDING',
    applicationDate: '2024-07-20',
    comments: '',
    documents: 'https://8080-cfafccdbfbabebfafcccdccbdcbfbadaafcebeb.premiumproject.examly.io/doc.pdf',
    student: { name: 'John Doe', email: 'john@x.com', department: 'CS', yearOfStudy: 2, cgpa: 8.5 },
    scholarship: { name: 'Merit Scholarship', amount: 5000, deadline: '2024-09-01' }
  };
  beforeEach(() => jest.clearAllMocks());

  function renderDetail() {
    window.history.pushState({}, 'Application Detail', '/applications/1');
    return render(
      <BrowserRouter>
        <Routes>
          <Route path="/applications/:id" element={<ApplicationDetail />} />
        </Routes>
      </BrowserRouter>
    );
  }

  it('authority can change status/leave comment', async () => {
    axios.get.mockResolvedValueOnce({ data: application });
    axios.put.mockResolvedValueOnce({ data: { ...application, status: 'APPROVED', comments: 'Good!' } });
    renderDetail();
    await waitFor(() => screen.getByText(/John Doe/));
    fireEvent.change(screen.getByTestId('status-select'), { target: { value: 'APPROVED' } });
    fireEvent.change(screen.getByLabelText(/Comments/i), { target: { value: 'Good!' } });
    fireEvent.click(screen.getByRole('button', { name: /Update Status/ }));
    await waitFor(() => screen.getByText(/Status updated/));
    expect(screen.getByText(/Status updated/)).toBeInTheDocument();
    expect(axios.put).toHaveBeenCalledWith('http://localhost:8080/api/applications/1/status', { status: 'APPROVED', comments: 'Good!' });
  });
  
  it('shows error when not found', async () => {
    axios.get.mockRejectedValueOnce({});
    renderDetail();
    await waitFor(() => screen.getByText(/Failed to load application/));
  });
});
