import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";

const Dashboard = () => {

  const { aToken, dashData, getdashData, cancelAppointment } =
    useContext(AdminContext);

  useEffect(() => {
    if (aToken) {
      getdashData();
    }
  }, [aToken]);

  return dashData && (
    <div className="m-5">

      <p className="text-lg font-medium mb-5">Admin Dashboard</p>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-5 mb-8">

        <div className="bg-blue-100 p-5 rounded shadow">
          <p className="text-gray-600">Doctors</p>
          <p className="text-2xl font-bold">{dashData.doctors}</p>
        </div>

        <div className="bg-green-100 p-5 rounded shadow">
          <p className="text-gray-600">Appointments</p>
          <p className="text-2xl font-bold">{dashData.appointments}</p>
        </div>

        <div className="bg-purple-100 p-5 rounded shadow">
          <p className="text-gray-600">Patients</p>
          <p className="text-2xl font-bold">{dashData.patients}</p>
        </div>

      </div>

      {/* Latest Appointments */}

      <div className="bg-white border rounded">

        <div className="p-4 border-b">
          <p className="font-medium">Latest Appointments</p>
        </div>

        {dashData.latestAppointments.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between px-6 py-4 border-b"
          >

            {/* Patient Info */}
            <div className="flex items-center gap-3">
              <img
                src={item.userData.image}
                alt=""
                className="w-10 h-10 rounded-full"
              />

              <div>
                <p className="font-medium">{item.userData.name}</p>
                <p className="text-sm text-gray-500">
                  {item.slotDate} | {item.slotTime}
                </p>
              </div>
            </div>

            {/* Doctor */}
            <p className="text-sm">{item.docData.name}</p>

            {/* Action */}
            {item.cancelled ? (
              <p className="text-red-500">Cancelled</p>
            ) : (
              <button
                onClick={() => cancelAppointment(item._id)}
                className="text-red-500 border px-3 py-1 rounded hover:bg-red-500 hover:text-white"
              >
                Cancel
              </button>
            )}

          </div>
        ))}

      </div>

    </div>
  );
};

export default Dashboard;