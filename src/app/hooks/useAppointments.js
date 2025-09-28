import { useEffect, useState } from "react";
import api from "../utils/api";

export default function useAppointments(role = "user") {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const url = role === "doctor" ? "/appointments/doctor" : "/appointments/user";
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(url);
        setAppointments(data);
      } finally { setLoading(false); }
    };
    fetchAppointments();
  }, [role]);

  return { appointments, loading };
}
