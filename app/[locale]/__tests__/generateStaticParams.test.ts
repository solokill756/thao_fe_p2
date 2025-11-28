import { getSupportedLocales } from '@/app/lib/i18n-config';

// Mock i18n-config
jest.mock('@/app/lib/i18n-config', () => ({
  getSupportedLocales: jest.fn(() => ['en', 'vi']),
  i18nConfig: {
    locales: ['en', 'vi'],
    defaultLocale: 'en',
  },
}));

const mockGetSupportedLocales = getSupportedLocales as jest.MockedFunction<
  typeof getSupportedLocales
>;

describe('Layout - generateStaticParams', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateStaticParams', () => {
    it('should generate static params for all supported locales', async () => {
      // Import dynamically after mocks are set up
      const module = await import('../layout');
      const generateStaticParams = module.generateStaticParams;

      const result = await generateStaticParams();

      expect(result).toHaveLength(2);
      expect(result).toContainEqual({ locale: 'en' });
      expect(result).toContainEqual({ locale: 'vi' });
    });

    it('should call getSupportedLocales', async () => {
      jest.clearAllMocks();
      const module = await import('../layout');
      const generateStaticParams = module.generateStaticParams;

      await generateStaticParams();

      expect(mockGetSupportedLocales).toHaveBeenCalled();
    });

    it('should map locales correctly', async () => {
      const module = await import('../layout');
      const generateStaticParams = module.generateStaticParams;

      const result = await generateStaticParams();

      expect(result.every((param) => 'locale' in param)).toBe(true);
      expect(result.every((param) => typeof param.locale === 'string')).toBe(true);
    });

    it('should return correct structure for each locale', async () => {
      const module = await import('../layout');
      const generateStaticParams = module.generateStaticParams;

      const result = await generateStaticParams();

      result.forEach((param) => {
        expect(param).toHaveProperty('locale');
        expect(['en', 'vi']).toContain(param.locale);
      });
    });
  });
});

