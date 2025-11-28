import { ReactNode } from 'react';
import LanguageSwitcher from '@/app/components/common/LanguageSwitcher';
import Header from './components/RenderHeader';
import LayoutContent from './LayoutContent';
import type { DictType } from '@/app/lib/types/dictType';
import RenderFooter from './components/RenderFooter';

interface MainLayoutWrapperProps {
  children: ReactNode;
  locale: string;
  dictionary: DictType;
}

export default function MainLayoutWrapper({
  children,
  locale,
  dictionary,
}: MainLayoutWrapperProps) {
  return (
    <LayoutContent
      locale={locale}
      dictionary={dictionary}
      shouldShowLayout={true}
      headerComponent={
        <Header locale={locale as 'en' | 'vi'} dictionary={dictionary} />
      }
      footerComponent={<RenderFooter dictionary={dictionary} />}
      languageSwitcher={<LanguageSwitcher dictionary={dictionary} />}
    >
      {children}
    </LayoutContent>
  );
}
