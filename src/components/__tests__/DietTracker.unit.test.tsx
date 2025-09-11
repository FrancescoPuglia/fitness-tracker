import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import DietTracker from '../DietTracker';
import { Storage } from '../../storage';
import { clearTestData, seedDietData } from '../../../tests/utils/idb/seed';

vi.mock('../../storage', () => ({
  Storage: {
    getDietDay: vi.fn(),
    saveDietDay: vi.fn(),
  }
}));

const mockedStorage = vi.mocked(Storage);

describe('unit: DietTracker Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    clearTestData();
  });

  it('loads today diet and displays meals', async () => {
    const dietDay = seedDietData();
    mockedStorage.getDietDay.mockReturnValue(dietDay);

    render(<DietTracker />);
    
    expect(await screen.findByText('Breakfast')).toBeInTheDocument();
    expect(await screen.findByText('Lunch')).toBeInTheDocument();
    expect(screen.getByText('0 / 2 pasti completati')).toBeInTheDocument();
  });

  it('toggles meal completion and updates calories', async () => {
    const user = userEvent.setup();
    const dietDay = seedDietData();
    mockedStorage.getDietDay.mockReturnValue(dietDay);

    render(<DietTracker />);
    
    const breakfastCheckbox = await screen.findByRole('checkbox', { name: /breakfast/i });
    await user.click(breakfastCheckbox);
    
    await waitFor(() => {
      expect(mockedStorage.saveDietDay).toHaveBeenCalledWith(
        expect.objectContaining({
          meals: expect.arrayContaining([
            expect.objectContaining({
              name: 'Breakfast',
              completed: true
            })
          ])
        })
      );
    });
  });

  it('displays correct macros summary', async () => {
    const dietDay = seedDietData();
    // Mark breakfast as completed
    dietDay.meals[0].completed = true;
    mockedStorage.getDietDay.mockReturnValue(dietDay);

    render(<DietTracker />);
    
    // Should show calories from completed meal only
    expect(await screen.findByText('400')).toBeInTheDocument(); // calories
    expect(screen.getByText('20g')).toBeInTheDocument(); // protein
    expect(screen.getByText('40g')).toBeInTheDocument(); // carbs
    expect(screen.getByText('15g')).toBeInTheDocument(); // fat
  });

  it('updates meal macros in edit mode', async () => {
    const user = userEvent.setup();
    mockedStorage.getDietDay.mockReturnValue(seedDietData());

    render(<DietTracker />);
    
    const editButton = await screen.findByRole('button', { name: /modifica/i });
    await user.click(editButton);
    
    const caloriesInput = await screen.findByDisplayValue('400');
    await user.clear(caloriesInput);
    await user.type(caloriesInput, '450');
    
    await waitFor(() => {
      expect(mockedStorage.saveDietDay).toHaveBeenCalledWith(
        expect.objectContaining({
          meals: expect.arrayContaining([
            expect.objectContaining({
              calories: 450
            })
          ])
        })
      );
    });
  });
});