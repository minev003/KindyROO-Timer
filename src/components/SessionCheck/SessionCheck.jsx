"use client"

import {useSession} from "next-auth/react";
import React, {useEffect} from "react";
import {useRouter} from "next/navigation";
import Script from "next/script";
import LoadingScreen from "@/components/LoadingScreen/LoadingScreen";

let was_called = false;
const SessionCheck = ({children}) => {
    const session = useSession();
    const router = useRouter();

    useEffect(() => {
        if (session.status === "unauthenticated") {
            router.push("/login");
            return
        } else if (!was_called && session.status !== undefined) {
            console.log('Ran once!!!!!')

            was_called = true;
            console.log('Session update.')
            session.update();
            return
        }

    }, [session, router]);

// // If this is not here it will enter an infinite recursion
//     if (!was_called && session.status !== undefined) {
//         was_called = true;
//         console.log('Session update.')
//         session.update();
//     }

    if (session.status === "loading" && session.data === undefined) {
        return (
            <LoadingScreen></LoadingScreen>
        );
    }

    if (session.status === "authenticated" || (session.status === "loading" && session.data !== undefined && session.data !== 'unauthenticated')) {
        return children;
    }
};

export default SessionCheck;