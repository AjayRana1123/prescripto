import React, { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";

const AllAppointments = () => {

  const { aToken, appointments, getAllAppointments, cancelAppointment } =
    useContext(AdminContext);

  const [statusFilter, setStatusFilter] = useState("active");
  const [searchPatient, setSearchPatient] = useState("");
  const [searchDoctor, setSearchDoctor] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (aToken) {
      getAllAppointments();
    }
  }, [aToken]);

  // ---------- Statistics ----------

  const totalAppointments = appointments.length;
  const cancelledAppointments = appointments.filter(a => a.cancelled).length;
  const activeAppointments = totalAppointments - cancelledAppointments;

  // ---------- Filtering + Sorting ----------

  const filteredAppointments = appointments
    .filter((item) => {

      if (statusFilter === "active" && item.cancelled) return false;
      if (statusFilter === "cancelled" && !item.cancelled) return false;

      if (
        searchPatient &&
        !item.userData?.name
          .toLowerCase()
          .includes(searchPatient.toLowerCase())
      ) {
        return false;
      }

      if (
        searchDoctor &&
        !item.docData?.name
          .toLowerCase()
          .includes(searchDoctor.toLowerCase())
      ) {
        return false;
      }

      if (dateFilter && item.slotDate !== dateFilter) {
        return false;
      }

      return true;
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  // ---------- Open Cancel Modal ----------

  const openCancelModal = (appointmentId) => {
    setSelectedAppointment(appointmentId);
    setShowModal(true);
  };

  // ---------- Confirm Cancellation ----------

  const confirmCancel = () => {

    if (!reason) {
      toast.error("Please provide cancellation reason");
      return;
    }

    cancelAppointment(selectedAppointment, reason);

    setShowModal(false);
    setReason("");
  };

  return (
    <div className="w-full max-w-6xl m-5">

      <p className="text-lg font-semibold mb-4">All Appointments</p>

      {/* ---------- Statistics ---------- */}

      <div className="grid grid-cols-3 gap-4 mb-6">

        <div className="bg-blue-100 p-4 rounded">
          <p className="text-sm text-gray-600">Total</p>
          <p className="text-xl font-bold">{totalAppointments}</p>
        </div>

        <div className="bg-green-100 p-4 rounded">
          <p className="text-sm text-gray-600">Active</p>
          <p className="text-xl font-bold">{activeAppointments}</p>
        </div>

        <div className="bg-red-100 p-4 rounded">
          <p className="text-sm text-gray-600">Cancelled</p>
          <p className="text-xl font-bold">{cancelledAppointments}</p>
        </div>

      </div>

      {/* ---------- Filters ---------- */}

      <div className="grid grid-cols-4 gap-4 mb-4">

        <input
          type="text"
          placeholder="Search patient..."
          value={searchPatient}
          onChange={(e) => setSearchPatient(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          type="text"
          placeholder="Search doctor..."
          value={searchDoctor}
          onChange={(e) => setSearchDoctor(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="border p-2 rounded"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="active">Active</option>
          <option value="cancelled">Cancelled</option>
          <option value="all">All</option>
        </select>

      </div>

      {/* ---------- Table Header ---------- */}

      <div className="grid grid-cols-[0.5fr_2fr_1fr_2fr_1fr_1fr] py-3 px-6 border bg-gray-100 text-sm font-semibold text-gray-700">

        <p>#</p>
        <p>Patient</p>
        <p>Date</p>
        <p>Doctor</p>
        <p>Fees</p>
        <p>Action</p>

      </div>

      {/* ---------- Appointment List ---------- */}

      {filteredAppointments.map((item, index) => (

        <div
          key={item._id}
          className="grid grid-cols-[0.5fr_2fr_1fr_2fr_1fr_1fr] items-center text-sm py-3 px-6 border-b text-gray-700"
        >

          <p>{index + 1}</p>

          {/* Patient */}

          <div className="flex items-center gap-3">
            <img
              className="w-8 h-8 rounded-full"
              src={item.userData?.image}
              alt=""
            />
            <p>{item.userData?.name}</p>
          </div>

          {/* Date */}

          <p>
            {item.slotDate} | {item.slotTime}
          </p>

          {/* Doctor */}

          <div className="flex items-center gap-3">
            <img
              className="w-8 h-8 rounded-full"
              src={item.docData?.image}
              alt=""
            />
            <p>{item.docData?.name}</p>
          </div>

          {/* Fees */}

          <p>${item.amount}</p>

          {/* Action */}

          {item.cancelled ? (
           <div>

<p className="text-red-500 font-medium">
Cancelled
</p>

<p className="text-xs text-gray-500">
Reason: {item.cancelReason}
</p>

</div>
          ) : (
            <button
              onClick={() => openCancelModal(item._id)}
              className="text-red-500 border border-red-500 px-3 py-1 rounded hover:bg-red-500 hover:text-white transition"
            >
              Cancel
            </button>
          )}

        </div>

      ))}

      {filteredAppointments.length === 0 && (
        <p className="text-center py-6 text-gray-500">
          No appointments found
        </p>
      )}

      {/* ---------- Cancel Modal ---------- */}

      {showModal && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white p-6 rounded-lg w-[400px] shadow-lg">

            <h2 className="text-lg font-semibold mb-4">
              Cancel Appointment
            </h2>

            <p className="text-sm text-gray-600 mb-3">
              Please select or enter the reason for cancellation.
            </p>

            <select
              className="w-full border p-2 rounded mb-3"
              onChange={(e) => setReason(e.target.value)}
            >

              <option value="">Select Reason</option>
              <option value="Patient unavailable">
                Patient unavailable
              </option>
              <option value="Doctor unavailable">
                Doctor unavailable
              </option>
              <option value="Emergency">
                Emergency
              </option>
              <option value="Rescheduling">
                Rescheduling
              </option>

            </select>

            <textarea
              placeholder="Or type custom reason..."
              className="w-full border p-2 rounded mb-4"
              onChange={(e) => setReason(e.target.value)}
            />

            <div className="flex justify-end gap-3">

              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded"
              >
                Close
              </button>

              <button
                onClick={confirmCancel}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Confirm Cancel
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default AllAppointments;