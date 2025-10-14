"use client"

import useUserData from "@/lib/hooks";
import { authAtom, type AuthState } from "@/lib/atoms";
import { useEffect, useMemo } from "react";
import { useSetAtom } from "jotai";
import { useHydrateAtoms } from "jotai/utils";

interface AuthProviderProps {
  children: React.ReactNode;
  initialAuth?: AuthState;
}

export default function AuthProvider({ children, initialAuth }: AuthProviderProps) {
  const fallbackAuth = useMemo<AuthState>(
    () => initialAuth ?? { user: null, profile: null },
    [initialAuth]
  );

  useHydrateAtoms([[authAtom, fallbackAuth]]);

  const setAuthAtom = useSetAtom(authAtom);
  const { user, profile, isInitializing } = useUserData(initialAuth);

  useEffect(() => {
    if (isInitializing) return;
    setAuthAtom({ user, profile });
  }, [user, profile, isInitializing, setAuthAtom]);

  return <>{children}</>;
}
