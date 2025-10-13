"use client"

import useUserData from "@/lib/hooks";
import { authAtom } from "@/lib/atoms"
import { useSetAtom } from "jotai"
import { useEffect } from "react";


export default function AuthProvider({ children }:any) {
  const setAuthAtom = useSetAtom(authAtom);
  const { user, profile } = useUserData();

  useEffect( () => {
    setAuthAtom({ user, profile });
  }, [user, profile, setAuthAtom])



  return (
    <>
      { children }
    </>
  )
}