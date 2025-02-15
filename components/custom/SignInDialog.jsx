import React, { useContext } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import Lookup from '@/data/Lookup'
import { Button } from '../ui/button'
import { useGoogleLogin } from '@react-oauth/google'
import axios from 'axios'
import { UserDetailContext } from '@/context/UserDetailContext'
import { useMutation } from 'convex/react'
import uuid4 from 'uuid4'
import { api } from '@/convex/_generated/api'

const SignInDialog = ({ openDialog, closeDialog }) => {
    const { setUserDetail } = useContext(UserDetailContext);
    const CreateUser = useMutation(api.users.CreateUser);

    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            console.log(tokenResponse);
            const userInfo = await axios.get(
                'https://www.googleapis.com/oauth2/v3/userinfo',
                { headers: { Authorization: 'Bearer ' + tokenResponse?.access_token } },
            );
            console.log(userInfo);
            const user = userInfo.data;
            await CreateUser({
                name: user?.name,
                email: user?.email,
                picture: user?.picture,
                uid: uuid4()
            })

            if (typeof window !== 'undefined') {
                console.log("Saving user to localStorage:", user);
                localStorage.setItem('user', JSON.stringify(user));
                console.log("User saved to localStorage");
            }

            setUserDetail(userInfo?.data);

            // save inside database
            closeDialog(false);
        },
        onError: errorResponse => console.log(errorResponse),
    });

    return (
        <Dialog open={openDialog} onOpenChange={closeDialog}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{/* Optionally add a title here */}</DialogTitle>
                    <DialogDescription>
                        {Lookup.SIGNIN_SUBHEADING}
                    </DialogDescription>
                </DialogHeader>
                {/* Move block-level elements outside of DialogDescription */}
                <div className="flex flex-col items-center justify-center gap-3 mt-4">
                    <h2 className='font-bold text-2xl text-center text-white'>
                        {Lookup.SIGNIN_HEADING} AI
                    </h2>
                    <Button
                        className='bg-blue-500 text-white hover:bg-blue-400 mt-3'
                        onClick={googleLogin}
                    >
                        Sign In With Google
                    </Button>
                    <div className='text-center mt-2'>
                        {Lookup?.SIGNIN_AGREEMENT_TEXT}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default SignInDialog
