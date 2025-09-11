import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import WorkoutTracker from '../WorkoutTracker';
import { Storage } from '../../storage';
import { clearTestData, seedWorkoutData } from '../../../tests/utils/idb/seed';

// Mock Storage to avoid actual localStorage calls
vi.mock('../../storage', () => ({
  Storage: {
    getWorkoutDay: vi.fn(),
    saveWorkoutDay: vi.fn(),
    savePersonalRecord: vi.fn(),
  }
}));

const mockedStorage = vi.mocked(Storage);

describe('unit: WorkoutTracker Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    clearTestData();
  });

  it('loads today workout and displays exercises', async () => {
    const workoutDay = seedWorkoutData();
    mockedStorage.getWorkoutDay.mockReturnValue(workoutDay);

    render(<WorkoutTracker />);
    
    expect(await screen.findByText('Squat')).toBeInTheDocument();
    expect(await screen.findByText('Bench Press')).toBeInTheDocument();
    expect(screen.getByText('0 / 2 esercizi completati')).toBeInTheDocument();
  });

  it('toggles exercise completion and saves to storage', async () => {
    const user = userEvent.setup();
    const workoutDay = seedWorkoutData();
    mockedStorage.getWorkoutDay.mockReturnValue(workoutDay);

    render(<WorkoutTracker />);
    
    const squatCheckbox = await screen.findByLabelText('Mark Squat as completed');
    expect(squatCheckbox).not.toBeChecked();

    await user.click(squatCheckbox);
    
    await waitFor(() => {
      expect(mockedStorage.saveWorkoutDay).toHaveBeenCalledWith(
        expect.objectContaining({
          exercises: expect.arrayContaining([
            expect.objectContaining({
              name: 'Squat',
              completed: true
            })
          ])
        })
      );
    });
  });

  it('updates weight input and triggers PR save', async () => {
    const user = userEvent.setup();
    const workoutDay = seedWorkoutData();
    mockedStorage.getWorkoutDay.mockReturnValue(workoutDay);

    render(<WorkoutTracker />);
    
    const weightInput = await screen.findByDisplayValue('100');
    await user.clear(weightInput);
    await user.type(weightInput, '125');
    
    await waitFor(() => {
      expect(mockedStorage.savePersonalRecord).toHaveBeenCalledWith({
        exerciseName: 'Squat',
        weight: 125,
        reps: 12,
        date: '2025-09-11'
      });
    });
  });

  it('starts and stops timer correctly', async () => {
    const user = userEvent.setup();
    mockedStorage.getWorkoutDay.mockReturnValue(seedWorkoutData());

    render(<WorkoutTracker />);
    
    const startButton = await screen.findByRole('button', { name: /avvia/i });
    await user.click(startButton);
    
    expect(screen.getByRole('button', { name: /stop/i })).toBeInTheDocument();
    
    // Wait a bit and check timer is running
    await waitFor(() => {
      expect(screen.getByText('0:01')).toBeInTheDocument();
    }, { timeout: 1200 });
  });

  it('adds new exercise when in edit mode', async () => {
    const user = userEvent.setup();
    mockedStorage.getWorkoutDay.mockReturnValue(seedWorkoutData());

    render(<WorkoutTracker />);
    
    const editButton = await screen.findByRole('button', { name: /modifica/i });
    await user.click(editButton);
    
    const addButton = screen.getByRole('button', { name: /aggiungi esercizio/i });
    await user.click(addButton);
    
    await waitFor(() => {
      expect(mockedStorage.saveWorkoutDay).toHaveBeenCalledWith(
        expect.objectContaining({
          exercises: expect.arrayContaining([
            expect.objectContaining({
              name: 'Nuovo Esercizio'
            })
          ])
        })
      );
    });
  });
});