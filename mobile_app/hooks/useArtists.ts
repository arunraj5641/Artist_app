import { useState, useEffect, useCallback } from "react";
import { Artist, getArtists } from "../services/artists";
import { useRef } from "react";

export const useArtists = (search: string) => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const requestRef = useRef(0);
  
  const fetchArtists = useCallback(async () => {
    const requestId = ++requestRef.current;

    try {
      if (search) {
        setSearchLoading(true);
      } else {
        setLoading(true);
      }

      const data = await getArtists(search);
      if (requestId === requestRef.current) {
        setArtists(data);
      }
    } catch (err) {
        console.error(err);
        setError("Failed to load artists");
    } finally {
      if (requestId === requestRef.current) {
        if (search) {
          setSearchLoading(false);
        } else {
          setLoading(false);
        }
      }
    }
  }, [search]);

  useEffect(() => {
    fetchArtists();
  }, [fetchArtists]);

  
  return { artists, loading, searchLoading , error};
};