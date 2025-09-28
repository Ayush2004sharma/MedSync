import { useEffect, useState } from "react";
import api from "../utils/api";

export default function useDoctors(query = {}) {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams(query).toString();
        const { data } = await api.get(`/doctors?${params}`);
        setDoctors(data);
      } finally { setLoading(false); }
    };
    fetchDoctors();
  }, [JSON.stringify(query)]);

  return { doctors, loading };
}
