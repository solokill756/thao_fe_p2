import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PaymentMethodSelector from '../PaymentMethodSelector';

// Mock child components
jest.mock('../CardPaymentForm', () => {
  return function MockCardPaymentForm() {
    return <div data-testid="card-payment-form">Card Payment Form</div>;
  };
});

jest.mock('../BankingPaymentForm', () => {
  return function MockBankingPaymentForm() {
    return <div data-testid="banking-payment-form">Banking Payment Form</div>;
  };
});

// Mock lucide-react
jest.mock('lucide-react', () => ({
  CreditCard: () => <div data-testid="credit-card-icon" />,
  Building: () => <div data-testid="building-icon" />,
  CheckCircle: () => <div data-testid="check-circle-icon" />,
}));

describe('PaymentMethodSelector Component', () => {
  const mockOnPaymentMethodChange = jest.fn();
  const mockOnCardDataChange = jest.fn();
  const mockDictionary = {
    payment: {
      payWith: 'Pay with',
      creditDebitCard: 'Credit/Debit Card',
      internetBanking: 'Internet Banking',
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
    it('should render payment method selector', () => {
      const { container } = render(
        <PaymentMethodSelector
          paymentMethod="card"
          onPaymentMethodChange={mockOnPaymentMethodChange}
          cardData={mockCardData}
          onCardDataChange={mockOnCardDataChange}
          dictionary={mockDictionary}
        />
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render title', () => {
      render(
        <PaymentMethodSelector
          paymentMethod="card"
          onPaymentMethodChange={mockOnPaymentMethodChange}
          cardData={mockCardData}
          onCardDataChange={mockOnCardDataChange}
          dictionary={mockDictionary}
        />
      );
      expect(screen.getByText('Pay with')).toBeInTheDocument();
    });

    it('should render both payment method options', () => {
      render(
        <PaymentMethodSelector
          paymentMethod="card"
          onPaymentMethodChange={mockOnPaymentMethodChange}
          cardData={mockCardData}
          onCardDataChange={mockOnCardDataChange}
          dictionary={mockDictionary}
        />
      );
      expect(screen.getByText('Credit/Debit Card')).toBeInTheDocument();
      expect(screen.getByText('Internet Banking')).toBeInTheDocument();
    });
  });

  describe('Payment Method Selection', () => {
    it('should highlight card method when selected', () => {
      const { container } = render(
        <PaymentMethodSelector
          paymentMethod="card"
          onPaymentMethodChange={mockOnPaymentMethodChange}
          cardData={mockCardData}
          onCardDataChange={mockOnCardDataChange}
          dictionary={mockDictionary}
        />
      );
      const cardOption = screen.getByText('Credit/Debit Card').closest('div');
      expect(cardOption).toHaveClass('border-blue-600', 'bg-blue-50');
    });

    it('should highlight banking method when selected', () => {
      const { container } = render(
        <PaymentMethodSelector
          paymentMethod="internet_banking"
          onPaymentMethodChange={mockOnPaymentMethodChange}
          cardData={mockCardData}
          onCardDataChange={mockOnCardDataChange}
          dictionary={mockDictionary}
        />
      );
      const bankingOption = screen
        .getByText('Internet Banking')
        .closest('div');
      expect(bankingOption).toHaveClass('border-blue-600', 'bg-blue-50');
    });

    it('should call onPaymentMethodChange when card option is clicked', () => {
      render(
        <PaymentMethodSelector
          paymentMethod="internet_banking"
          onPaymentMethodChange={mockOnPaymentMethodChange}
          cardData={mockCardData}
          onCardDataChange={mockOnCardDataChange}
          dictionary={mockDictionary}
        />
      );
      const cardOption = screen.getByText('Credit/Debit Card').closest('div');
      fireEvent.click(cardOption!);
      expect(mockOnPaymentMethodChange).toHaveBeenCalledWith('card');
    });

    it('should call onPaymentMethodChange when banking option is clicked', () => {
      render(
        <PaymentMethodSelector
          paymentMethod="card"
          onPaymentMethodChange={mockOnPaymentMethodChange}
          cardData={mockCardData}
          onCardDataChange={mockOnCardDataChange}
          dictionary={mockDictionary}
        />
      );
      const bankingOption = screen
        .getByText('Internet Banking')
        .closest('div');
      fireEvent.click(bankingOption!);
      expect(mockOnPaymentMethodChange).toHaveBeenCalledWith('internet_banking');
    });
  });

  describe('Form Rendering', () => {
    it('should render CardPaymentForm when card method is selected', () => {
      render(
        <PaymentMethodSelector
          paymentMethod="card"
          onPaymentMethodChange={mockOnPaymentMethodChange}
          cardData={mockCardData}
          onCardDataChange={mockOnCardDataChange}
          dictionary={mockDictionary}
        />
      );
      expect(screen.getByTestId('card-payment-form')).toBeInTheDocument();
    });

    it('should render BankingPaymentForm when banking method is selected', () => {
      render(
        <PaymentMethodSelector
          paymentMethod="internet_banking"
          onPaymentMethodChange={mockOnPaymentMethodChange}
          cardData={mockCardData}
          onCardDataChange={mockOnCardDataChange}
          dictionary={mockDictionary}
        />
      );
      expect(screen.getByTestId('banking-payment-form')).toBeInTheDocument();
    });
  });

  describe('Dictionary Fallbacks', () => {
    it('should use constants when dictionary values are missing', () => {
      const incompleteDict = { payment: {} } as any;
      render(
        <PaymentMethodSelector
          paymentMethod="card"
          onPaymentMethodChange={mockOnPaymentMethodChange}
          cardData={mockCardData}
          onCardDataChange={mockOnCardDataChange}
          dictionary={incompleteDict}
        />
      );
      // Should still render
      expect(screen.getByText('Credit/Debit Card')).toBeInTheDocument();
    });
  });
});

