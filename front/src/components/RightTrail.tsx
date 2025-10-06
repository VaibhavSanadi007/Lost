import type { FC } from "react"

type property = {
  flag : string;
}

const RightTrail: FC<property> = ({ flag }) => {
 
  return (
     // Right rail with Sponsored card and Recent Messages
    <aside className={` xl:block hidden xl:w-80 shrink-0 ${flag ? 'opacity-0 pointer-events-none':'' }`}>
      <div className="sticky top-0 space-y-4 p-4">
        {/* Sponsored */}
        <div className="border border-gray-200 bg-white rounded-xl overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Sponsored
            </p>
          </div>
          <div className="p-4">
            <div className="aspect-[16/9] w-full rounded-lg bg-gray-200" />
            <h4 className="mt-3 font-medium text-sm">Email marketing</h4>
            <p className="text-sm text-gray-600">
              Supercharge your marketing with a powerful, easy-to-use platform
              built for results.
            </p>
          </div>
        </div>

        {/* Recent Messages */}
        <div className="border border-gray-200 bg-white rounded-xl">
          <div className="p-4 border-b border-gray-200">
            <h4 className="font-medium">Recent Messages</h4>
          </div>
          <ul className="p-2">
            {[
              { name: "Richard Hendricks", msg: "I seen your profile", time: "3 hours ago" },
              { name: "John Warren", msg: "This is a Samsung Tablet", time: "8 days ago" },
              { name: "Alexa James", msg: "how are you", time: "15 days ago", unread: true },
            ].map((m, i) => (
              <li
                key={i}
                className="flex items-center justify-between gap-3 px-2 py-3 rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-gray-300" />
                  <div>
                    <p className="text-sm font-medium">{m.name}</p>
                    <p className="text-xs text-gray-500">{m.msg}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-500">{m.time}</p>
                  {m.unread ? (
                    <span className="mt-1 inline-block h-2 w-2 rounded-full bg-indigo-600" />
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  )
}
export default RightTrail