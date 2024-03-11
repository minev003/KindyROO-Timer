'use client';


import Link from 'next/link'
import React, {Suspense, useEffect, useState} from "react";
import Image from 'next/image'
import {getProviders, signIn, signOut, useSession} from "next-auth/react";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import Script from 'next/script'
//import LoaderHTML from 'src/components/Loader/LoaderHtml.js';
import {MoonLoader} from 'react-spinners'
import {displayContent} from "next/dist/client/dev/fouc";
// import '@tanstack/react-table'
// import {useReactTable} from '@tanstack/react-table'
// import DataTable from 'react-data-table-component'
import LoadingScreen from "src/components/LoadingScreen/LoadingScreen.js";
import BreadCrumbs from "src/components/BreadCrumb.js";

export default function UserPage({params}) {
    const session = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const [dataFromAPI, setDataFromAPI] = useState(null)
    const [showMe, setShowMe] = useState(false);
    const [usernam, setUsernam] = useState('');
    const [userpass, setUserpass] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [visible, setVisible] = useState(false);
    const [visible2, setVisible2] = useState(false);

    const [dataFromAPIInfo, setDataFromAPIInfo] = useState('');

    console.log('Before:', params.user_pass)
    const paramsUser_Pass2 = params.user_pass;

    // const paramsUser_Pass2 = decodeURI(params.user_pass);
    // console.log('After (paramsUser_view2):', paramsUser_Pass2)

    useEffect(() => {
        console.log('history.state ', history.state, ' and ', 'location.pathname ', location.pathname)
        window.history.replaceState(window.history.state, '', location.pathname.toLowerCase())
        // const split = location.pathname.split('/');
        // const usr = paramsUser_Pass2.toLowerCase()
        //     .replace(/[^a-z0-9-]/g, '-')
        // ;
        //
        // console.log('usr ', usr, 'history.state ', history.state, ' and ', 'location.pathname ', location.pathname)
        // window.history.replaceState(window.history.state, '', '/users/password/' + usr)
        // alert('history.state ' + history.state + ' and ' + 'location.pathname ' + location.pathname)

        // if (pathname !== pathname.toLowerCase()) {
        //     router.push(pathname.toLowerCase())
        // }

        console.log('session: ', session)
        if (session.status === "unauthenticated") {
            router?.push("/login");
        }

        if (session.data != undefined) {
            if (session.data.user.role_id !== 'admin') {
                router?.push("/");
            } else {
                setShowMe(true);
            }
        }

        const fetchUsers2 = async () => {
            const response = await fetch('/api/dynrout/', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    'slug_user': paramsUser_Pass2,
                })
            });
            const dataPOSTUsr = await response;

            console.log('response ', response.url)


            if (response.url.includes(`/${params.user_pass}`)) {
                console.log('Correct User.')
            } else {
                console.log(response.url);
                // window.location = response.url;
                router?.push(response.url);
            }

            setDataFromAPI(dataPOSTUsr)
        };

        fetchUsers2();

        //=============================================

        const checkIfUserViewExists = async () => {
            let responseUsrView = await fetch('/api/view_user/', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    'slug_user': paramsUser_Pass2,
                })
            });
            const dataPOSTUsrView = await responseUsrView.json();
            // const dataPOSTUsrViewJSON = await responseUsrView.json()

            console.log('responserrrr ', dataPOSTUsrView)
            // console.log('response json ', dataPOSTUsrViewJSON)

            setUsernam(dataPOSTUsrView.username)
            console.log('setUsernam(dataPOSTUsrView.username) ', usernam)
        };

        checkIfUserViewExists();

    }, [session, router]);

    if (session.status === "loading") {
        return (
            <>
                <LoadingScreen></LoadingScreen>
            </>
        );
    }

    async function handleClickUpdateUserPass(e) {
        e.preventDefault();
        console.log('clickedddd update')
        console.log('paramsUser_view2 ', paramsUser_Pass2)
        console.log('userpass ', userpass)
        console.log('confirmPassword ', confirmPassword)

        if (userpass === confirmPassword) {
            console.log('userpass === confirmPassword true')

            let respPOSTUpdate = await fetch('/api/pass_update/', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    'slug_user': paramsUser_Pass2,
                    'password': userpass,
                })
            });

            const dataUpdate = await respPOSTUpdate;
            // add password updated page + button back to users?

            console.log(dataUpdate.url);

            if (dataUpdate.url.includes(`/users`)) {
                router?.push(dataUpdate.url);
            }

        } else {
            console.log('userpass === confirmPassword false')
            // to implement error showing
        }

    }

    const togglePassword2 = () => {
        setVisible2(!visible2);
    };

    const togglePassword = () => {
        setVisible(!visible);
    };


    if (session.status === "authenticated" && session.data.user.role_id === 'admin') {

        const breadCrumbs = [
            {
                name: "Home",
                url: "/"
            },
            {
                name: `Users`,
                url: `/users`,
            },
            {
                name: `Password ${usernam}`,
                url: `/users/password/${paramsUser_Pass2}`,
            },
        ];


        return (

            <>

                <div className="container row">

                    <div className="col min-vh-100 p-4">

                        <div className="card mb-3">
                            <div className="card-header row g-3">

                                <div className="col-lg-6">
                                    <h5 className="mb-0">Change {usernam}'s password:</h5>
                                </div>

                                <div
                                    className="col-lg-6 d-flex justify-content-end align-items-center ">

                                    <button className="btn btn-outline-primary" type="submit"
                                            form="passUpdateForm">Update
                                        Password
                                    </button>
                                </div>

                            </div>
                            <div className="card-body bg-light">

                                <form id="passUpdateForm" autoComplete="off"
                                      onSubmit={handleClickUpdateUserPass}
                                      className="row g-3">
                                    <div className="col-lg-6">

                                        <label className="form-label" htmlFor="pass1">New
                                            Password</label>
                                        <input className="form-control" required id="pass1"
                                               type={visible ? "text" : "password"}
                                               placeholder="New Password"
                                               value={userpass}
                                               onChange={({target}) =>
                                                   setUserpass(target?.value)
                                               }/>
                                        <i className={visible ? "bi bi-eye" : "bi bi-eye-slash"}
                                           id="togglePassword1"
                                           type="button"
                                           onClick={togglePassword}
                                           style={{cursor: "pointer"}}
                                        > Show password</i>

                                    </div>
                                    <div className="col-lg-6">

                                    </div>

                                    <div className="col-lg-6">

                                        <label className="form-label" htmlFor="pass2">Confirm
                                            Password</label>
                                        <input className="form-control" required id="pass2"
                                               type={visible2 ? "text" : "password"}
                                               placeholder="Confirm Password"
                                               value={confirmPassword}
                                               onChange={({target}) =>
                                                   setConfirmPassword(target?.value)
                                               }/>
                                        <i className={visible2 ? "bi bi-eye" : "bi bi-eye-slash"}
                                           id="togglePassword2"
                                           type="button"
                                           onClick={togglePassword2}
                                           style={{cursor: "pointer"}}
                                        > Show password</i>

                                    </div>

                                    <div className="col-lg-6">

                                    </div>

                                </form>

                            </div>
                        </div>

                    </div>
                </div>

            </>

        );

    }
}