"use client";
import Form from "./Form";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loader from "./components/Loader";

const AddPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/Login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <Loader/>;
  }

  return (
    <div className="min-h-screen">
      {/* <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8"> */}
      <div className="px-4 py-6 sm:px-0 mx-auto">
        <Form mode="create" />
      </div>
      {/* </div> */}
    </div>
  );
};

export default AddPage;
