import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SeminarList from '../components/SeminarList';
import axios from 'axios';
import { Seminar } from '../@types';

// Mock для axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockSeminars: Seminar[] = [
  {
    id: 1,
    title: 'Test Seminar',
    description: 'Test Description',
    date: '01.01.2025',
    time: '10:00',
    photo: 'https://picsum.photos/id/1/750',
  },
];

const mockSetSeminars = jest.fn();

describe('SeminarList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading state initially', () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockSeminars });
    render(<SeminarList seminars={[]} setSeminars={mockSetSeminars} />);
    expect(screen.getByText('Загрузка семинаров...')).toBeInTheDocument();
    expect(screen.getByTestId('loader')).toHaveClass('animate-spin');
  });

  test('renders error state when fetch fails', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('Network Error'));
    render(<SeminarList seminars={[]} setSeminars={mockSetSeminars} />);
    await waitFor(() => {
      expect(screen.getByText('Не удалось загрузить данные с сервера. Попробуйте позже.')).toBeInTheDocument();
      expect(screen.queryByText('Загрузка семинаров...')).not.toBeInTheDocument();
    });
  });

});