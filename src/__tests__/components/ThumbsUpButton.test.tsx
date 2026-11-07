import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { ThumbsUpButton } from '@/components/ThumbsUpButton';

describe('ThumbsUpButton', () => {
  it('renders the like count with number display format', () => {
    render(<ThumbsUpButton isLike={false} number={1234} onPress={() => true} />);
    expect(screen.getByText('1.2k')).toBeInTheDocument();
  });

  it('calls onPress when clicked', async () => {
    const onPress = jest.fn().mockResolvedValue(true);
    render(<ThumbsUpButton isLike={false} number={0} onPress={onPress} />);
    const button = screen.getByRole('button');
    await userEvent.click(button);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', async () => {
    const onPress = jest.fn();
    render(<ThumbsUpButton isLike={false} number={0} onPress={onPress} disabled />);
    const button = screen.getByRole('button');
    await userEvent.click(button);
    expect(onPress).not.toHaveBeenCalled();
  });

  it('does not throw when onPress returns false', async () => {
    const onPress = jest.fn().mockResolvedValue(false);
    render(<ThumbsUpButton isLike={true} number={5} onPress={onPress} />);
    const button = screen.getByRole('button');
    await userEvent.click(button);
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
