'use client'

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { decryptKey, encryptKey } from "@/lib/utils"  // Ensure the encryptKey utility is correctly imported.

import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

const PasskeyModal = () => {
    const router = useRouter();
    const path = usePathname();
    const [open, setOpen] = useState(true);
    const [passkey, setPasskey] = useState('');
    const [error, setError] = useState('');

    // Only access localStorage if window is defined.
    const encryptedKey = typeof window !== 'undefined' ? window.localStorage.getItem('accessKey') : null;

    // Added passkey to the dependency array to ensure the effect runs when passkey changes.
    useEffect(() => {
        const accessKey = encryptedKey && decryptKey(encryptedKey);

      if (path && accessKey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
        setOpen(false);
        router.push('/admin');
      }
    }, [passkey, path, router])

    const validatePasskey = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();

        if (passkey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
            const encryptedKey = encryptKey(passkey);

            localStorage.setItem('accessKey', encryptedKey);

            // Log the encryptedKey after it's set in localStorage
            console.log('accessKey:', encryptedKey);

            setOpen(false);
            router.push('/admin');  // Moved routing inside the condition.
        } else {
            setError('Invalid Passkey. Please try again.')
        }
    }

    const closeModal = () => {
        setOpen(false);
        router.push('/')
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent className="shad-alert-dialog">
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-start justify-between">
                    Admin Access Verification
                    <Image
                        src="/assets/icons/close.svg"
                        alt="close"
                        width={20}
                        height={20}
                        onClick={() => closeModal()}
                        className="cursor-pointer"
                    />
                </AlertDialogTitle>
                <AlertDialogDescription>
                  To access the admin page, please enter the passkey.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <div>
                <InputOTP maxLength={6} value={passkey} onChange={(value) => setPasskey(value)}>
                    <InputOTPGroup className="shad-otp">
                        <InputOTPSlot className="shad-otp-slot" index={0} />
                        <InputOTPSlot className="shad-otp-slot" index={1} />
                        <InputOTPSlot className="shad-otp-slot" index={2} />
                        <InputOTPSlot className="shad-otp-slot" index={3} />
                        <InputOTPSlot className="shad-otp-slot" index={4} />
                        <InputOTPSlot className="shad-otp-slot" index={5} />
                    </InputOTPGroup>
                </InputOTP>

                {error && 
                   <p className="shad-error text-14-regular mt-4 flex justify-center">
                        {error}
                    </p>
                }
              </div>

              <AlertDialogFooter>
                <AlertDialogAction onClick={(e) => validatePasskey(e)} className="shad-primary-btn w-full">
                    Enter Admin Passkey
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default PasskeyModal