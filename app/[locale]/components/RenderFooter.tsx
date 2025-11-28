import RenderCopyright from '@/app/components/common/RenderCopyright';
import { FOOTER_CONSTANTS } from '@/app/lib/constants';
import { DictType } from '@/app/lib/types';
import Link from 'next/link';

interface RenderFooterProps {
  dictionary: DictType;
}
export default function RenderFooter({ dictionary }: RenderFooterProps) {
  const footerDict = dictionary.footer;
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 border-b border-gray-700 pb-8 mb-8">
          <div>
            <h4 className="text-2xl font-bold text-blue-400 mb-4">
              Travel<span className="text-orange-500">.</span>
            </h4>
            <p className="text-gray-400 text-sm">
              {footerDict?.description || FOOTER_CONSTANTS.DESCRIPTION}
            </p>
          </div>
          <div>
            <h5 className="font-semibold mb-4 text-lg">
              {footerDict?.company || FOOTER_CONSTANTS.COMPANY}
            </h5>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link href="#" className="hover:text-blue-400 transition">
                  {footerDict?.aboutUs || FOOTER_CONSTANTS.ABOUT_US}
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-blue-400 transition">
                  {footerDict?.careers || FOOTER_CONSTANTS.CAREERS}
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-blue-400 transition">
                  {footerDict?.blog || FOOTER_CONSTANTS.BLOG}
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-blue-400 transition">
                  {footerDict?.pricing || FOOTER_CONSTANTS.PRICING}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold mb-4 text-lg">
              {footerDict?.destinations || FOOTER_CONSTANTS.DESTINATIONS}
            </h5>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link href="#" className="hover:text-blue-400 transition">
                  {footerDict?.maldives || FOOTER_CONSTANTS.MALDIVES}
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-blue-400 transition">
                  {footerDict?.losAngeles || FOOTER_CONSTANTS.LOS_ANGELES}
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-blue-400 transition">
                  {footerDict?.lasVegas || FOOTER_CONSTANTS.LAS_VEGAS}
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-blue-400 transition">
                  {footerDict?.toronto || FOOTER_CONSTANTS.TORONTO}
                </Link>
              </li>
            </ul>
          </div>
          <div className="col-span-2 md:col-span-2">
            <h5 className="font-semibold mb-4 text-lg">
              {footerDict?.joinOurNewsletter ||
                FOOTER_CONSTANTS.JOIN_OUR_NEWSLETTER}
            </h5>
            <p className="text-gray-400 text-sm mb-4">
              {footerDict?.newsletterDescription ||
                FOOTER_CONSTANTS.NEWSLETTER_DESCRIPTION}
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="p-3 w-full rounded-l-lg text-gray-800 focus:outline-none"
              />
              <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-r-lg transition duration-300">
                {footerDict?.subscribe || FOOTER_CONSTANTS.SUBSCRIBE}
              </button>
            </div>
          </div>
        </div>
        <RenderCopyright
          copyright={footerDict?.copyright || FOOTER_CONSTANTS.COPYRIGHT}
        />
      </div>
    </footer>
  );
}
