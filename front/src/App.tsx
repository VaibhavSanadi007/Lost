import getUserData from "./custom_component/GetUserData";
import MainRoutes from "./routes/MainRoutes"
import { ReactLenis } from 'lenis/react'
export const url = import.meta.env.VITE_backUrl;

const App = () => {

  getUserData();

return (
    // bg-gradient-to-r from-slate-900 to-slate-700
    <>
   <ReactLenis root options={{
        duration: 0.8,       
        easing: (t) => t * (2 - t),  
      }} />
    <div className=""> 
      <MainRoutes/>
    </div>
    </>
  )
}
export default App
