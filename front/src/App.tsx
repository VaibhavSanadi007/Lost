import MainRoutes from "./routes/MainRoutes"

export const url = import.meta.env.VITE_backUrl;

const App = () => {

  return (
    // bg-gradient-to-r from-slate-900 to-slate-700
    <div className="h-screen "> 
      <MainRoutes/>
    </div>
  )
}
export default App
