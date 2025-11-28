import { TourPlan as TourPlanType } from '@/app/lib/types/tourTypes';
import { CheckCircle } from 'lucide-react';
import { DictType } from '@/app/lib/types';

interface TourPlanProps {
  plans: TourPlanType[];
  dictionary: DictType;
}

export default function TourPlan({ plans, dictionary }: TourPlanProps) {
  const tourDetailDict = dictionary.tourDetail;

  return (
    <div className="mt-10">
      <h3 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-3">
        {tourDetailDict?.tourPlan || 'Tour Plan'}
      </h3>
      <div className="space-y-8">
        {plans.map((item) => (
          <div key={item.plan_day_id} className="flex relative items-start">
            <div className="h-full w-0.5 bg-blue-200 absolute left-3 top-0 bottom-0 z-0"></div>

            <div className="relative z-10 w-7 h-7 flex items-center justify-center bg-blue-600 rounded-full text-white font-bold text-sm shrink-0 mr-4 mt-1">
              {item.day_number}
            </div>
            <div className="grow pb-8">
              <h4 className="text-xl font-semibold text-gray-800 mb-1">
                {tourDetailDict?.day || 'Day'} {item.day_number}: {item.title}
              </h4>
              <p className="text-gray-600 mb-3">{item.description}</p>
              {item.inclusions &&
                typeof item.inclusions === 'object' &&
                Array.isArray(item.inclusions) && (
                  <div className="flex flex-wrap gap-4 text-sm text-blue-600">
                    {(item.inclusions as string[]).map((inclusion, index) => (
                      <span key={index} className="flex items-center">
                        <CheckCircle className="w-4 h-4 mr-1" /> {inclusion}
                      </span>
                    ))}
                  </div>
                )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
