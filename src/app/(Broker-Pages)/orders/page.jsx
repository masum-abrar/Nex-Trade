import Navbar from "../Components/Navbar";
import Sidebar from "../Components/Sidebar";

const OrdersPage = () => {
    return (
        <div className="flex ">
            <Sidebar />
            <div className="flex-1">
                <Navbar />
                <div className="bg-[#071824] h-screen ">
                    <div className="executed-orders-broker">
                        <div className="lot-qty1 flex justify-between items-center bg-[#071824] p-8 border-b border-gray-700 shadow">
                            <div className="lot-qty2 flex space-x-2">
                                <button className="px-4 py-2 bg-gray-700 text-white rounded-lg">Executed Orders</button>
                                <button className="px-4 py-2 bg-gray-700 text-white rounded-lg">Limit Orders</button>
                                <button className="px-4 py-2 bg-gray-700 text-white rounded-lg">Rejected Orders</button>
                            </div>
                        </div>
                        <div className="top-headline-e mt-4 text-lg font-semibold text-white p-8 pt-0 pb-0">Executed Orders</div>
                        <div className="p-8 ">
                            <input 
                                type="text" 
                                placeholder="Search In Table" 
                                className="border px-2 py-1 w-full rounded bg-gray-700 text-white"
                            />
                            <div className=" text-white mt-4">No Executed orders available.</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrdersPage;
