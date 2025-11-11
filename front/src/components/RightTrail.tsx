import type { FC } from "react"
import sponsorImg from '../assets/sponsored_img.png';

type property = {
  flag : string;
}

const RightTrail: FC<property> = ({ flag }) => {
 
  return (

    <aside className={` lg:block  hidden lg:w-60 xl:w-80 shrink-0 ${flag ? 'opacity-0 pointer-events-none':'' }`}>
      <div className="sticky top-0 space-y-4 p-4">
        {/* Sponsored */}
        <div className="border border-gray-200 bg-white rounded-xl overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Sponsored
            </p>
          </div>
          <div className="p-4">
            <img src={sponsorImg} className="rounded" />
            <h4 className="mt-3 font-medium text-sm">Email marketing</h4>
            <p className="text-sm text-gray-600">
              Supercharge your marketing with a powerful, easy-to-use platform
              built for results.
            </p>
          </div>
        </div>
      </div>
    </aside>
  )
}
export default RightTrail