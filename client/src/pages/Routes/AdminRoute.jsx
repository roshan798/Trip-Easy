import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import Spinner from "../components/Spinner";
import { loginAdmin } from "../../http";

export default function AdminRoute() {
  const { currentUser } = useSelector((state) => state.user);
  const [ok, setOk] = useState(false);

  const authCheck = async () => {
    try {
      const { data } = await loginAdmin();
      console.log("admin login ", data);
      if (data.check) setOk(true);
      else setOk(false);
    } catch (error) {
      console.log(error);
      setOk(false);
    }
  };

  useEffect(() => {
    if (currentUser !== null) authCheck();
  }, [currentUser]);

  return ok ? <Outlet /> : <Spinner />;
}
