import React from 'react';
import { render, screen } from '@testing-library/react';
import BankingPaymentForm from '../BankingPaymentForm';
import { PAYMENT_CONSTANTS, PLACEHOLDER_IMAGE_URLS } from '@/app/lib/constants';

describe('BankingPaymentForm Component', () => {
  const mockDictionary = {
    payment: {
      scanQRCode: 'Scan QR Code to Pay via Banking App',
      supportedBanks: 'Supported Banks: Vietcombank, Techcombank, ACB...',
    },
  } as any;

  describe('Basic Rendering', () => {
    it('should render banking payment form', () => {
      const { container } = render(
        <BankingPaymentForm dictionary={mockDictionary} />
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render QR code instruction', () => {
      render(<BankingPaymentForm dictionary={mockDictionary} />);
      expect(
        screen.getByText('Scan QR Code to Pay via Banking App')
      ).toBeInTheDocument();
    });

    it('should render QR code image', () => {
      const { container } = render(
        <BankingPaymentForm dictionary={mockDictionary} />
      );
      const qrImage = container.querySelector('img[alt="QR Code"]');
      expect(qrImage).toBeInTheDocument();
      expect(qrImage).toHaveAttribute('src', PLACEHOLDER_IMAGE_URLS.QR_CODE);
    });

    it('should render supported banks text', () => {
      render(<BankingPaymentForm dictionary={mockDictionary} />);
      expect(
        screen.getByText('Supported Banks: Vietcombank, Techcombank, ACB...')
      ).toBeInTheDocument();
    });
  });

  describe('Dictionary Fallbacks', () => {
    it('should use constants when dictionary values are missing', () => {
      const incompleteDict = { payment: {} } as any;
      render(<BankingPaymentForm dictionary={incompleteDict} />);
      expect(
        screen.getByText(PAYMENT_CONSTANTS.SCAN_QR_CODE)
      ).toBeInTheDocument();
      expect(
        screen.getByText(PAYMENT_CONSTANTS.SUPPORTED_BANKS)
      ).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('should have correct container classes', () => {
      const { container } = render(
        <BankingPaymentForm dictionary={mockDictionary} />
      );
      const formContainer = container.firstChild;
      expect(formContainer).toHaveClass('bg-gray-50', 'p-4', 'rounded-lg');
    });
  });
});

