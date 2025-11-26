import React from 'react';
import { render } from '@testing-library/react';
import CreateI18nProvider from '../i18n-provider';

// Mock react-i18next
jest.mock('react-i18next', () => ({
  I18nextProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="i18n-provider">{children}</div>
  ),
}));

jest.mock('react-i18next/initReactI18next', () => ({
  initReactI18next: jest.fn(),
}));

jest.mock('i18next', () => ({
  createInstance: jest.fn(() => ({
    use: jest.fn().mockReturnThis(),
    init: jest.fn(),
  })),
}));

describe('CreateI18nProvider Component', () => {
  const mockDictionary = {
    common: {
      test: 'Test',
    },
    homepage: {
      title: 'Home',
    },
  } as any;
  const mockChildren = <div data-testid="children">Children</div>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render children', () => {
    const { getByTestId } = render(
      <CreateI18nProvider locale="en" dictionary={mockDictionary}>
        {mockChildren}
      </CreateI18nProvider>
    );
    expect(getByTestId('children')).toBeInTheDocument();
  });

  it('should render I18nextProvider', () => {
    const { getByTestId } = render(
      <CreateI18nProvider locale="en" dictionary={mockDictionary}>
        {mockChildren}
      </CreateI18nProvider>
    );
    expect(getByTestId('i18n-provider')).toBeInTheDocument();
  });

  it('should initialize i18n with correct locale', () => {
    const { createInstance } = require('i18next');
    const mockInstance = {
      use: jest.fn().mockReturnThis(),
      init: jest.fn(),
    };
    createInstance.mockReturnValue(mockInstance);

    render(
      <CreateI18nProvider locale="vi" dictionary={mockDictionary}>
        {mockChildren}
      </CreateI18nProvider>
    );

    expect(createInstance).toHaveBeenCalled();
    expect(mockInstance.init).toHaveBeenCalledWith(
      expect.objectContaining({
        lng: 'vi',
        fallbackLng: 'en',
      })
    );
  });

  it('should initialize i18n with English locale', () => {
    const { createInstance } = require('i18next');
    const mockInstance = {
      use: jest.fn().mockReturnThis(),
      init: jest.fn(),
    };
    createInstance.mockReturnValue(mockInstance);

    render(
      <CreateI18nProvider locale="en" dictionary={mockDictionary}>
        {mockChildren}
      </CreateI18nProvider>
    );

    expect(mockInstance.init).toHaveBeenCalledWith(
      expect.objectContaining({
        lng: 'en',
      })
    );
  });

  it('should pass dictionary as translation resource', () => {
    const { createInstance } = require('i18next');
    const mockInstance = {
      use: jest.fn().mockReturnThis(),
      init: jest.fn(),
    };
    createInstance.mockReturnValue(mockInstance);

    render(
      <CreateI18nProvider locale="en" dictionary={mockDictionary}>
        {mockChildren}
      </CreateI18nProvider>
    );

    expect(mockInstance.init).toHaveBeenCalledWith(
      expect.objectContaining({
        resources: {
          en: {
            translation: mockDictionary,
          },
        },
      })
    );
  });

  it('should configure interpolation with escapeValue false', () => {
    const { createInstance } = require('i18next');
    const mockInstance = {
      use: jest.fn().mockReturnThis(),
      init: jest.fn(),
    };
    createInstance.mockReturnValue(mockInstance);

    render(
      <CreateI18nProvider locale="en" dictionary={mockDictionary}>
        {mockChildren}
      </CreateI18nProvider>
    );

    expect(mockInstance.init).toHaveBeenCalledWith(
      expect.objectContaining({
        interpolation: {
          escapeValue: false,
        },
      })
    );
  });
});

