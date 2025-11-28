import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PaymentForm from '../PaymentForm';
import { PAYMENT_CONSTANTS } from '@/app/lib/constants';

// Mock PaymentMethodSelector
jest.mock('../PaymentMethodSelector', () => {
  return function MockPaymentMethodSelector() {
    return <div data-testid="payment-method-selector">Payment Method Selector</div>;
  };
});

// Mock lucide-react
jest.mock('lucide-react', () => ({
  Lock: () => <div data-testid="lock-icon" />,
}));

describe('PaymentForm Component', () => {
  const mockOnSubmit = jest.fn();
  const mockOnPaymentMethodChange = jest.fn();
  const mockOnCardDataChange = jest.fn();
  const mockFormatCurrency = (amount: number) => `$${amount.toFixed(2)}`;

  const mockCardData = {
    cardNumber: '',
    expiration: '',
    cvc: '',
  };

  const mockDictionary = {
    payment: {
      confirmAndPay: 'Confirm and Pay',
      processing: 'Processing...',
      paymentsSecure: 'Payments are secure and encrypted.',
    },
  } as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render payment form', () => {
      const { container } = render(
        <PaymentForm
          paymentMethod="card"
          onPaymentMethodChange={mockOnPaymentMethodChange}
          cardData={mockCardData}
          onCardDataChange={mockOnCardDataChange}
          onSubmit={mockOnSubmit}
          isProcessing={false}
          total={1100}
          locale="en"
          dictionary={mockDictionary}
          formatCurrency={mockFormatCurrency}
        />
      );
      const form = container.querySelector('form');
      expect(form).toBeInTheDocument();
    });

    it('should render payment method selector', () => {
      render(
        <PaymentForm
          paymentMethod="card"
          onPaymentMethodChange={mockOnPaymentMethodChange}
          cardData={mockCardData}
          onCardDataChange={mockOnCardDataChange}
          onSubmit={mockOnSubmit}
          isProcessing={false}
          total={1100}
          locale="en"
          dictionary={mockDictionary}
          formatCurrency={mockFormatCurrency}
        />
      );
      expect(screen.getByTestId('payment-method-selector')).toBeInTheDocument();
    });

    it('should render submit button', () => {
      render(
        <PaymentForm
          paymentMethod="card"
          onPaymentMethodChange={mockOnPaymentMethodChange}
          cardData={mockCardData}
          onCardDataChange={mockOnCardDataChange}
          onSubmit={mockOnSubmit}
          isProcessing={false}
          total={1100}
          locale="en"
          dictionary={mockDictionary}
          formatCurrency={mockFormatCurrency}
        />
      );
      expect(screen.getByText(/Confirm and Pay/)).toBeInTheDocument();
    });

    it('should display total amount', () => {
      render(
        <PaymentForm
          paymentMethod="card"
          onPaymentMethodChange={mockOnPaymentMethodChange}
          cardData={mockCardData}
          onCardDataChange={mockOnCardDataChange}
          onSubmit={mockOnSubmit}
          isProcessing={false}
          total={1100}
          locale="en"
          dictionary={mockDictionary}
          formatCurrency={mockFormatCurrency}
        />
      );
      expect(screen.getByText('$1100.00')).toBeInTheDocument();
    });
  });

  describe('Form Submission', () => {
    it('should call onSubmit when form is submitted', () => {
      render(
        <PaymentForm
          paymentMethod="card"
          onPaymentMethodChange={mockOnPaymentMethodChange}
          cardData={mockCardData}
          onCardDataChange={mockOnCardDataChange}
          onSubmit={mockOnSubmit}
          isProcessing={false}
          total={1100}
          locale="en"
          dictionary={mockDictionary}
          formatCurrency={mockFormatCurrency}
        />
      );
      const form = screen.getByText(/Confirm and Pay/).closest('form');
      fireEvent.submit(form!);
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    });
  });

  describe('Processing State', () => {
    it('should show processing state when isProcessing is true', () => {
      render(
        <PaymentForm
          paymentMethod="card"
          onPaymentMethodChange={mockOnPaymentMethodChange}
          cardData={mockCardData}
          onCardDataChange={mockOnCardDataChange}
          onSubmit={mockOnSubmit}
          isProcessing={true}
          total={1100}
          locale="en"
          dictionary={mockDictionary}
          formatCurrency={mockFormatCurrency}
        />
      );
      expect(screen.getByText('Processing...')).toBeInTheDocument();
      const button = screen.getByText('Processing...').closest('button');
      expect(button).toBeDisabled();
    });
  });

  describe('Dictionary Fallbacks', () => {
    it('should use constants when dictionary values are missing', () => {
      const incompleteDict = { payment: {} } as any;
      render(
        <PaymentForm
          paymentMethod="card"
          onPaymentMethodChange={mockOnPaymentMethodChange}
          cardData={mockCardData}
          onCardDataChange={mockOnCardDataChange}
          onSubmit={mockOnSubmit}
          isProcessing={false}
          total={1100}
          locale="en"
          dictionary={incompleteDict}
          formatCurrency={mockFormatCurrency}
        />
      );
      expect(
        screen.getByText(PAYMENT_CONSTANTS.CONFIRM_AND_PAY)
      ).toBeInTheDocument();
    });
  });
});

