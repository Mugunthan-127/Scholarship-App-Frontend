import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import StudentForm from '../components/StudentForm';
import axios from 'axios';

jest.mock('axios');

describe('StudentForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('renders all required fields', () => {
    render(<StudentForm />);
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone Number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Department/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Year of Study/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/CGPA/i)).toBeInTheDocument();
    expect(screen.getByRole('button', {name: /register/i})).toBeInTheDocument();
  });
  
  it('shows validation errors', async () => {
    render(<StudentForm />);
    fireEvent.click(screen.getByRole('button', {name: /register/i}));
    await waitFor(() => {
      expect(screen.getByText(/Name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Valid email required/i)).toBeInTheDocument();
    });
  });

  it('shows API error message', async () => {
    axios.post.mockRejectedValueOnce({ response: { data: { message: 'Email already exists' } } });
    render(<StudentForm />);
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john@x.com' } });
    fireEvent.change(screen.getByLabelText(/Phone Number/i), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByLabelText(/Department/i), { target: { value: 'CS' } });
    fireEvent.change(screen.getByLabelText(/Year of Study/i), { target: { value: '2' } });
    fireEvent.change(screen.getByLabelText(/CGPA/i), { target: { value: '8.5' } });
    fireEvent.click(screen.getByRole('button'));
    await screen.findByText(/Email already exists/);
  });

  it('shows success message on registered', async () => {
    axios.post.mockResolvedValueOnce({ data: { name: 'John Doe', id: 1 } });
    render(<StudentForm />);
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john@x.com' } });
    fireEvent.change(screen.getByLabelText(/Phone Number/i), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByLabelText(/Department/i), { target: { value: 'CS' } });
    fireEvent.change(screen.getByLabelText(/Year of Study/i), { target: { value: '2' } });
    fireEvent.change(screen.getByLabelText(/CGPA/i), { target: { value: '8.5' } });
    fireEvent.click(screen.getByRole('button'));
    await screen.findByText(/Student registered successfully/);
  });
});
