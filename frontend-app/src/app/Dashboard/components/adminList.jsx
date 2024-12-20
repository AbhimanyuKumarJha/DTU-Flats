import { useEffect, useState } from "react";
import api from "../../lib/services/api";
import { FaTrash, FaPlus } from "react-icons/fa";
import { adminSchema } from "../../lib/validations/formSchemas";

const AdminList = () => {
  const [adminList, setAdminList] = useState([]);
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showAddConfirmation, setShowAddConfirmation] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedAdminId, setSelectedAdminId] = useState(null);

  const validatedAdmin = adminSchema.safeParse({
    name: adminName,
    email: adminEmail,
  });

  useEffect(() => {
    api.getAllAdmins().then((data) => setAdminList(data));
  }, []);

  const handleDelete = (adminId) => {
    setShowDeleteConfirmation(true);
    setSelectedAdminId(adminId);
  };

  const confirmDelete = () => {
    api.deleteAdmin(selectedAdminId).then(() => {
      setAdminList(adminList.filter((admin) => admin._id !== selectedAdminId));
      setShowDeleteConfirmation(false);
      setSuccessMessage("Admin deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    });
  };

  const handleAddAdmin = () => {
    if (validatedAdmin.success) {
      setShowAddConfirmation(true);
    }
  };

  const confirmAddAdmin = () => {
    api.createAdmin(validatedAdmin.data).then((data) => {
      setAdminList([...adminList, data]);
      setAdminName("");
      setAdminEmail("");
      setShowAddConfirmation(false);
      setSuccessMessage("Admin added successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    });
  };

  return (
    <div className="flex flex-col items-center h-full w-full rounded-lg bg-white bg-opacity-55 backdrop-blur-sm p-4  text-gray-800">
      <h1 className="text-2xl font-bold mt-3 mb-3">Admin List</h1>

      {successMessage && (
        <div className="mb-4 p-2 bg-green-300 text-green-800 rounded-md">
          {successMessage}
        </div>
      )}

      <div className="flex flex-col items-center justify-center text-gray-800 gap-2 w-5/6">
        <div className="flex items-center justify-center gap-2 h-fit bg-blue-300 p-2 w-full rounded-md">
          <input
            type="text"
            placeholder="Add Admin name"
            value={adminName}
            onChange={(e) => setAdminName(e.target.value)}
            className="h-8 bg-none border-none rounded-md outline-none w-full text-base text-black p-2"
          />
          <input
            type="text"
            placeholder="Add Admin email"
            value={adminEmail}
            onChange={(e) => setAdminEmail(e.target.value)}
            className="h-8 bg-none border-none rounded-md outline-none w-full text-base text-black p-2"
          />
          <button
            className="h-8 bg-blue-500 text-white p-2 rounded-md"
            onClick={handleAddAdmin}
          >
            <FaPlus />
          </button>
        </div>

        {adminList.map((admin) => (
          <div
            key={admin._id}
            className="relative grid grid-cols-9 gap-2 rounded-md bg-slate-200 p-2 items-center w-full"
          >
            <p className="col-span-4">
              <b>Name:</b> {admin.name}
            </p>
            <p className="col-span-4">
              <b>Email:</b> {admin.email}
            </p>
            <button
              className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-md w-fit"
              onClick={() => handleDelete(admin._id)}
            >
              <FaTrash />
            </button>
          </div>
        ))}
      </div>

      {showDeleteConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-lg">
            <p>Are you sure you want to delete this admin?</p>
            <div className="flex gap-4 mt-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md"
                onClick={confirmDelete}
              >
                Confirm
              </button>
              <button
                className="bg-gray-300 px-4 py-2 rounded-md"
                onClick={() => setShowDeleteConfirmation(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-lg">
            <p>Are you sure you want to add this admin?</p>
            <div className="flex gap-4 mt-4">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-md"
                onClick={confirmAddAdmin}
              >
                Confirm
              </button>
              <button
                className="bg-gray-300 px-4 py-2 rounded-md"
                onClick={() => setShowAddConfirmation(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminList;
