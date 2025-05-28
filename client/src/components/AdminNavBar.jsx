import React from "react";

const AdminNavBar = ({ arr, selectedValue, setSelectedValue, setToken }) => {
  return (
    <div className="flex flex-col justify-between items-start  py-10 w-full max-w-full border border-transparent rounded-tr-2xl rounded-br-2xl h-screen bg-gradient-to-r from-gray-900 via-slate-800 to-gray-700">
      <div className="flex flex-col justify-start items-start space-y-8 w-full">
        <div className="flex space-x-2 justify-start items-center px-4">
          <img
            src="https://mymodernmet.com/wp/wp-content/uploads/2019/09/100k-ai-faces-6.jpg"
            className="w-10 h-10 border rounded-full"
          />
          <div className="flex flex-col space-y-1">
            <p className="text-xl text-white font-semibold">Vicky</p>
            <p className="text-xs text-white font-semibold">UI/UX Designer</p>
          </div>
        </div>

        <div className="flex flex-col space-y-4  w-full">
          {arr.map((each, index) => (
            <div className="relative" key={index}>
              <button
                onClick={() => setSelectedValue(each)}
                className={`
          w-[101%] py-2 pl-4 text-left transition-all duration-200 relative z-10 flex items-center cursor-pointer
          ${
            selectedValue === each
              ? "bg-white text-gray-800 rounded-l-full"
              : "bg-transparent text-white hover:bg-gray-200/20"
          }
        `}
              >
                {getIcon(each)}

                {each}
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full px-4 flex items-center space-x-2 hover:scale-110">
        <IoIosLogOut size={30} className="text-white font-semibold " />
        <button
          onClick={() => {
            localStorage.removeItem("Token");
            setToken("");
          }}
          className="cursor-pointer  text-xl font-semibold text-white"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminNavBar;
