import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CardPaymentForm from '../CardPaymentForm';
import { PAYMENT_CONSTANTS } from '@/app/lib/constants';

// Mock lucide-react
jest.mock('lucide-react', () => ({
  CreditCard: () => <div data-testid="credit-card-icon" />,
}));

describe('CardPaymentForm Component', () => {
  const mockOnCardDataChange = jest.fn();
  const mockDictionary = {
    payment: {
      cardNumber: 'Card Number',
      expiration: 'Expiration',
      cvc: 'CVC',
    },
  } as any;

  const mockCardData = {
    cardNumber: '',
    expiration: '',
    cvc: '',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render card number input', () => {
      render(
        <CardPaymentForm
          cardData={mockCardData}
          onCardDataChange={mockOnCardDataChange}
          dictionary={mockDictionary}
        />
      );
      expect(screen.getByLabelText('Card Number')).toBeInTheDocument();
    });

    it('should render expiration input', () => {
      render(
        <CardPaymentForm
          cardData={mockCardData}
          onCardDataChange={mockOnCardDataChange}
          dictionary={mockDictionary}
        />
      );
      expect(screen.getByLabelText('Expiration')).toBeInTheDocument();
    });

    it('should render CVC input', () => {
      render(
        <CardPaymentForm
          cardData={mockCardData}
          onCardDataChange={mockOnCardDataChange}
          dictionary={mockDictionary}
        />
      );
      expect(screen.getByLabelText('CVC')).toBeInTheDocument();
    });

    it('should render credit card icon', () => {
      render(
        <CardPaymentForm
          cardData={mockCardData}
          onCardDataChange={mockOnCardDataChange}
          dictionary={mockDictionary}
        />
      );
      expect(screen.getByTestId('credit-card-icon')).toBeInTheDocument();
    });
  });

  describe('Input Handling', () => {
    it('should call onCardDataChange when card number changes', () => {
      render(
        <CardPaymentForm
          cardData={mockCardData}
          onCardDataChange={mockOnCardDataChange}
          dictionary={mockDictionary}
        />
      );
      const cardNumberInput = screen.getByLabelText('Card Number');
      fireEvent.change(cardNumberInput, { target: { value: '1234 5678' } });
      expect(mockOnCardDataChange).toHaveBeenCalledWith({
        ...mockCardData,
        cardNumber: '12345678',
      });
    });

    it('should remove spaces from card number', () => {
      render(
        <CardPaymentForm
          cardData={mockCardData}
          onCardDataChange={mockOnCardDataChange}
          dictionary={mockDictionary}
        />
      );
      const cardNumberInput = screen.getByLabelText('Card Number');
      fireEvent.change(cardNumberInput, { target: { value: '1234 5678 9012 3456' } });
      expect(mockOnCardDataChange).toHaveBeenCalledWith({
        ...mockCardData,
        cardNumber: '1234567890123456',
      });
    });

    it('should call onCardDataChange when expiration changes', () => {
      render(
        <CardPaymentForm
          cardData={mockCardData}
          onCardDataChange={mockOnCardDataChange}
          dictionary={mockDictionary}
        />
      );
      const expirationInput = screen.getByLabelText('Expiration');
      fireEvent.change(expirationInput, { target: { value: '12/25' } });
      expect(mockOnCardDataChange).toHaveBeenCalledWith({
        ...mockCardData,
        expiration: '12/25',
      });
    });

    it('should remove non-digits from CVC', () => {
      render(
        <CardPaymentForm
          cardData={mockCardData}
          onCardDataChange={mockOnCardDataChange}
          dictionary={mockDictionary}
        />
      );
      const cvcInput = screen.getByLabelText('CVC');
      fireEvent.change(cvcInput, { target: { value: '12a3' } });
      expect(mockOnCardDataChange).toHaveBeenCalledWith({
        ...mockCardData,
        cvc: '123',
      });
    });
  });

  describe('Input Constraints', () => {
    it('should limit card number to 16 characters', () => {
      render(
        <CardPaymentForm
          cardData={mockCardData}
          onCardDataChange={mockOnCardDataChange}
          dictionary={mockDictionary}
        />
      );
      const cardNumberInput = screen.getByLabelText('Card Number');
      expect(cardNumberInput).toHaveAttribute('maxLength', '16');
    });

    it('should limit expiration to 5 characters', () => {
      render(
        <CardPaymentForm
          cardData={mockCardData}
          onCardDataChange={mockOnCardDataChange}
          dictionary={mockDictionary}
        />
      );
      const expirationInput = screen.getByLabelText('Expiration');
      expect(expirationInput).toHaveAttribute('maxLength', '5');
    });

    it('should limit CVC to 4 characters', () => {
      render(
        <CardPaymentForm
          cardData={mockCardData}
          onCardDataChange={mockOnCardDataChange}
          dictionary={mockDictionary}
        />
      );
      const cvcInput = screen.getByLabelText('CVC');
      expect(cvcInput).toHaveAttribute('maxLength', '4');
    });
  });

  describe('Dictionary Fallbacks', () => {
    it('should use constants when dictionary values are missing', () => {
      const incompleteDict = { payment: {} } as any;
      render(
        <CardPaymentForm
          cardData={mockCardData}
          onCardDataChange={mockOnCardDataChange}
          dictionary={incompleteDict}
        />
      );
      expect(
        screen.getByLabelText(PAYMENT_CONSTANTS.CARD_NUMBER)
      ).toBeInTheDocument();
    });
  });
});

