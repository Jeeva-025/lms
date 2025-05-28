import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Login";
import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MemberPage from "./pages/MemberPage";
import MemberNavBar from "./components/MemberNavBar";
import AdminNavBar from "./components/AdminNavBar";
import AdminPage from "./pages/AdminPage";
import "./App.css";
function App() {
  const emp = JSON.parse(localStorage.getItem("Employee"));
  const typ = emp?.type ? emp.type.trim().toLowerCase() : null;
  const tok = localStorage.getItem("Token") ?? null;
  const [token, setToken] = useState(tok);

  const [selectedValue, setSelectedValue] = useState("Dashboard");

  let arr;
  if (typ) {
    if (typ === "member") {
      arr = ["Dashboard", "Request Leave"];
    } else if (emp.designation.trim().toLowerCase() === "hr") {
      arr = ["Dashboard", "Requested Leave", "Request Leave", "Add People"];
    } else if (emp.designation.trim().toLowerCase() === "manager") {
      arr = ["Dashboard", "Requested Leave", "Request Leave"];
    } else {
      arr = ["Dashboard", "Requested Leave"];
    }
  }

  return (
    <BrowserRouter>
      <div className="flex flex-row space-x-1 h-screen w-full">
        {tok && (
          <div className="min-w-1/7 bg-gray-100 shadow-md">
            <MemberNavBar
              arr={arr}
              selectedValue={selectedValue}
              setSelectedValue={setSelectedValue}
              setToken={setToken}
            />
          </div>
        )}

        <div className="overflow-hidden w-full">
          <Routes>
            <Route
              path="/"
              element={
                tok ? (
                  typ === "admin" ? (
                    <AdminPage
                      arr={arr}
                      setSelectedValue={setSelectedValue}
                      selectedValue={selectedValue}
                    />
                  ) : (
                    <MemberPage
                      arr={arr}
                      setSelectedValue={setSelectedValue}
                      selectedValue={selectedValue}
                    />
                  )
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/login"
              element={
                !token ? (
                  <Login
                    setToken={setToken}
                    setSelectedValue={setSelectedValue}
                  />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
          </Routes>
        </div>
      </div>

      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
