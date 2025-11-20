import MobileMenu from "./pages/MobileMenu";
import MainRoutes from "./routes/MainRoutes"
import { ReactLenis } from 'lenis/react'
export const url = import.meta.env.VITE_backUrl;

const App = () => {

return (
    <>
   <ReactLenis root options={{
        duration: 0.8,       
        easing: (t) => t * (2 - t),  
      }} />
    <div className=""> 
      <MainRoutes/>
    </div>
    <MobileMenu/>
    </>
  )
}
export default App
