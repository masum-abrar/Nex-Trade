import { Toaster } from "react-hot-toast";
import HomePage from "./(Broker-Pages)/dashboard/page";


export default function Home() {
  return (
   <div>
    <HomePage/>
    <Toaster />
   </div>
  );
}
