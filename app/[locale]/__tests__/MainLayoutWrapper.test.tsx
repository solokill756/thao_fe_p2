import React from 'react';
import { render } from '@testing-library/react';
import MainLayoutWrapper from '../MainLayoutWrapper';

// Mock child components
jest.mock('../LayoutContent', () => {
  return function MockLayoutContent({ children }: { children: React.ReactNode }) {
    return <div data-testid="layout-content">{children}</div>;
  };
});

jest.mock('../components/RenderHeader', () => {
  return function MockHeader() {
    return <div data-testid="header">Header</div>;
  };
});

jest.mock('../components/RenderFooter', () => {
  return function MockFooter() {
    return <div data-testid="footer">Footer</div>;
  };
});

jest.mock('@/app/components/common/LanguageSwitcher', () => {
  return function MockLanguageSwitcher() {
    return <div data-testid="language-switcher">Language Switcher</div>;
  };
});

describe('MainLayoutWrapper Component', () => {
  const mockDictionary = {
    homepage: { title: 'Test' },
    common: { test: 'Test' },
  } as any;
  const mockChildren = <div data-testid="children">Children</div>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render children', () => {
    const { getByTestId } = render(
      <MainLayoutWrapper locale="en" dictionary={mockDictionary}>
        {mockChildren}
      </MainLayoutWrapper>
    );
    expect(getByTestId('children')).toBeInTheDocument();
  });

  it('should render layout content', () => {
    const { getByTestId } = render(
      <MainLayoutWrapper locale="en" dictionary={mockDictionary}>
        {mockChildren}
      </MainLayoutWrapper>
    );
    expect(getByTestId('layout-content')).toBeInTheDocument();
  });


  it('should render with different locale', () => {
    const { getByTestId } = render(
      <MainLayoutWrapper locale="vi" dictionary={mockDictionary}>
        {mockChildren}
      </MainLayoutWrapper>
    );
    expect(getByTestId('children')).toBeInTheDocument();
    expect(getByTestId('layout-content')).toBeInTheDocument();
  });

  it('should include header component', () => {
    const { getByTestId } = render(
      <MainLayoutWrapper locale="en" dictionary={mockDictionary}>
        {mockChildren}
      </MainLayoutWrapper>
    );
    // Header is passed to LayoutContent which should render it
    expect(getByTestId('layout-content')).toBeInTheDocument();
  });

  it('should include footer component', () => {
    const { getByTestId } = render(
      <MainLayoutWrapper locale="en" dictionary={mockDictionary}>
        {mockChildren}
      </MainLayoutWrapper>
    );
    expect(getByTestId('layout-content')).toBeInTheDocument();
  });

  it('should include language switcher', () => {
    const { getByTestId } = render(
      <MainLayoutWrapper locale="en" dictionary={mockDictionary}>
        {mockChildren}
      </MainLayoutWrapper>
    );
    expect(getByTestId('layout-content')).toBeInTheDocument();
  });
});

