import { useEffect, useState } from "react";
import api from "../../lib/services/api";
import { FaTrash, FaPlus } from "react-icons/fa";
import { adminSchema } from "../../lib/validations/formSchemas";

const AdminList = () => {
  const [adminList, setAdminList] = useState([]);
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");

  const validatedAdmin = adminSchema.safeParse({
    name: adminName,
    email: adminEmail,
  });
  useEffect(() => {
    api.getAllAdmins().then((data) => setAdminList(data));
    console.log(adminList);
  }, []);
  const handleDelete = (adminId) => {
    api.deleteAdmin(adminId).then((data) => {
      setAdminList(adminList.filter((admin) => admin._id !== adminId));
    });
  };
  const handleAddAdmin = () => {
    if (validatedAdmin.success) {
      api.createAdmin(validatedAdmin.data).then((data) => {
        setAdminList([...adminList, data]);
        setAdminName("");
        setAdminEmail("");
      });
    }
  };
  return (
    <div className="flex flex-col items-center  h-full w-full rounded-lg bg-gray-100 p-4 text-gray-800">
      <h1 className="text-2xl font-bold mt-3 mb-3">Admin List</h1>
      <div className="flex flex-col items-center justify-center text-gray-800 gap-2 w-5/6">
        <div className="flex items-center justify-center gap-2 h-fit bg-amber-400 p-2 w-full rounded-md ">
          <input
            type="text"
            placeholder="Add Admin name"
            value={adminName}
            onChange={(e) => setAdminName(e.target.value)}
            className="h-8 bg-none border-none rounded-md outline-none w-full text-base text-black p-2 "
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
            className="grid grid-cols-9 gap-4 rounded-md bg-amber-200 p-2 items-center w-full"
          >
            <p className="col-span-4">
              <b>Name:</b> {admin.name}
            </p>
            <p className="col-span-4">
              <b>Email:</b> {admin.email}
            </p>
            <button
              className="bg-red-500 text-white p-2 rounded-md col-span-1 w-fit"
              onClick={() => handleDelete(admin._id)}
            >
              <FaTrash />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminList;
