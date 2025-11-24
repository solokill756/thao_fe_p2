import { SERVICES_SECTION_CONSTANTS } from '@/app/lib/constants';
import { DictType } from '@/app/lib/types';
import { Compass, Heart, MapPin, TrendingUp } from 'lucide-react';

interface RenderServicesSectionProps {
  dictionary: DictType;
}
export default function RenderServicesSection({
  dictionary,
}: RenderServicesSectionProps) {
  const servicesDict = dictionary.services;
  const services = [
    {
      icon: <Compass className="w-6 h-6 text-white" />,
      title:
        servicesDict?.guidedTours || SERVICES_SECTION_CONSTANTS.GUIDED_TOURS,
      description:
        servicesDict?.guidedToursDescription ||
        SERVICES_SECTION_CONSTANTS.GUIDED_TOURS_DESCRIPTION,
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-white" />,
      title:
        servicesDict?.bestFlightsOptions ||
        SERVICES_SECTION_CONSTANTS.BEST_FLIGHTS_OPTIONS,
      description:
        servicesDict?.bestFlightsOptionsDescription ||
        SERVICES_SECTION_CONSTANTS.BEST_FLIGHTS_OPTIONS_DESCRIPTION,
    },
    {
      icon: <Heart className="w-6 h-6 text-white" />,
      title:
        servicesDict?.religiousTours ||
        SERVICES_SECTION_CONSTANTS.RELIGIOUS_TOURS,
      description:
        servicesDict?.religiousToursDescription ||
        SERVICES_SECTION_CONSTANTS.RELIGIOUS_TOURS_DESCRIPTION,
    },
    {
      icon: <MapPin className="w-6 h-6 text-white" />,
      title:
        servicesDict?.medicalInsurance ||
        SERVICES_SECTION_CONSTANTS.MEDICAL_INSURANCE,
      description:
        servicesDict?.medicalInsuranceDescription ||
        SERVICES_SECTION_CONSTANTS.MEDICAL_INSURANCE_DESCRIPTION,
    },
  ];
  return (
    <section id="services" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-blue-600 font-semibold mb-2">
          {servicesDict?.category || SERVICES_SECTION_CONSTANTS.CATEGORY}
        </p>
        <h2 className="text-4xl font-bold text-gray-800 mb-12">
          {servicesDict?.title || SERVICES_SECTION_CONSTANTS.DEFAULT_TITLE}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition duration-300 transform hover:scale-105 border-t-4 border-blue-500"
            >
              <div className="mx-auto w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-4">
                {service.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                {service.title}
              </h3>
              <p className="text-gray-600 text-sm">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
