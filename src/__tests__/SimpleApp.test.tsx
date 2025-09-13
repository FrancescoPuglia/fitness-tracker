import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import SimpleApp from '../SimpleApp';

describe('SimpleApp', () => {
  it('renders fitness tracker with workout tab', () => {
    render(<SimpleApp />);
    
    expect(screen.getByText('🏋️ Fitness Tracker')).toBeInTheDocument();
    expect(screen.getByText('Track your workouts and diet simply!')).toBeInTheDocument();
    expect(screen.getByText('Today\'s Workout')).toBeInTheDocument();
  });

  it('toggles exercise completion', async () => {
    const user = userEvent.setup();
    render(<SimpleApp />);
    
    const squatCheckbox = screen.getByLabelText('Mark Squat as completed');
    expect(squatCheckbox).not.toBeChecked();
    
    await user.click(squatCheckbox);
    expect(squatCheckbox).toBeChecked();
    expect(screen.getByText('✓ Done!')).toBeInTheDocument();
  });

  it('switches to diet tab and toggles meal', async () => {
    const user = userEvent.setup();
    render(<SimpleApp />);
    
    const dietTab = screen.getByRole('button', { name: '🍽️ Diet' });
    await user.click(dietTab);
    
    expect(screen.getByText('Today\'s Meals')).toBeInTheDocument();
    
    const breakfastCheckbox = screen.getByLabelText('Mark Breakfast as completed');
    await user.click(breakfastCheckbox);
    
    expect(breakfastCheckbox).toBeChecked();
    expect(screen.getByText('✓ Eaten!')).toBeInTheDocument();
  });

  it('shows completion counters', () => {
    render(<SimpleApp />);
    
    expect(screen.getByText('Completed: 0 / 3')).toBeInTheDocument();
  });

  it('shows success message', () => {
    render(<SimpleApp />);
    
    expect(screen.getByText(/🎉/)).toBeInTheDocument();
    expect(screen.getByText(/App is working perfectly!/)).toBeInTheDocument();
  });
});