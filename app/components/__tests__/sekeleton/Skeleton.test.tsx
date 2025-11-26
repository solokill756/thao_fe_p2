import React from 'react';
import { render } from '@testing-library/react';
import Skeleton from '../../sekeleton/Skeleton';

describe('Skeleton Component', () => {
  describe('Basic Rendering', () => {
    it('should render with default props', () => {
      const { container } = render(<Skeleton />);
      const skeleton = container.firstChild;
      expect(skeleton).toBeInTheDocument();
      expect(skeleton).toHaveClass(
        'bg-gray-200',
        'rounded-lg',
        'animate-pulse'
      );
    });

    it('should apply custom className', () => {
      const { container } = render(<Skeleton className="custom-class" />);
      const skeleton = container.firstChild;
      expect(skeleton).toHaveClass('custom-class');
    });
  });

  describe('Variants', () => {
    it('should render text variant', () => {
      const { container } = render(<Skeleton variant="text" />);
      const skeleton = container.firstChild;
      expect(skeleton).toHaveClass('rounded');
    });

    it('should render circular variant', () => {
      const { container } = render(<Skeleton variant="circular" />);
      const skeleton = container.firstChild;
      expect(skeleton).toHaveClass('rounded-full');
    });

    it('should render rectangular variant (default)', () => {
      const { container } = render(<Skeleton variant="rectangular" />);
      const skeleton = container.firstChild;
      expect(skeleton).toHaveClass('rounded-lg');
    });
  });

  describe('Animations', () => {
    it('should apply pulse animation (default)', () => {
      const { container } = render(<Skeleton animation="pulse" />);
      const skeleton = container.firstChild;
      expect(skeleton).toHaveClass('animate-pulse');
    });

    it('should apply wave animation', () => {
      const { container } = render(<Skeleton animation="wave" />);
      const skeleton = container.firstChild;
      expect(skeleton).toHaveClass('animate-shimmer');
    });

    it('should apply no animation', () => {
      const { container } = render(<Skeleton animation="none" />);
      const skeleton = container.firstChild;
      expect(skeleton).not.toHaveClass('animate-pulse', 'animate-shimmer');
    });
  });

  describe('Dimensions', () => {
    it('should apply numeric width', () => {
      const { container } = render(<Skeleton width={200} />);
      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton.style.width).toBe('200px');
    });

    it('should apply string width', () => {
      const { container } = render(<Skeleton width="50%" />);
      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton.style.width).toBe('50%');
    });

    it('should apply numeric height', () => {
      const { container } = render(<Skeleton height={100} />);
      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton.style.height).toBe('100px');
    });

    it('should apply string height', () => {
      const { container } = render(<Skeleton height="2rem" />);
      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton.style.height).toBe('2rem');
    });

    it('should apply both width and height', () => {
      const { container } = render(<Skeleton width={300} height={200} />);
      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton.style.width).toBe('300px');
      expect(skeleton.style.height).toBe('200px');
    });
  });

  describe('Combined Props', () => {
    it('should render with all props combined', () => {
      const { container } = render(
        <Skeleton
          variant="circular"
          animation="wave"
          width={50}
          height={50}
          className="custom-class"
        />
      );
      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton).toHaveClass(
        'rounded-full',
        'animate-shimmer',
        'custom-class'
      );
      expect(skeleton.style.width).toBe('50px');
      expect(skeleton.style.height).toBe('50px');
    });
  });
});
