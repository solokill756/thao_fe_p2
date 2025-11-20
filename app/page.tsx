import { redirect } from 'next/navigation';
import { i18nConfig } from './lib/i18n-config';

export default function RenderRootRedirect(): never {
  redirect(`/${i18nConfig.defaultLocale}`);
}
