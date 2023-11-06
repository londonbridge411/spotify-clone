import { useEffect, useState } from "react";
import supabase from "./config/supabaseClient";
 
const ModalProvider = () =>
{
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted)
        return null;

    return(
        <>
            Modals
        </>
    );
}

export default ModalProvider;