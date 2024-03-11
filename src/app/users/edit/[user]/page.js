'use client';

import 'bootstrap/dist/css/bootstrap.css'
import Link from 'next/link'
import React, {Suspense, useEffect, useState} from "react";
import Image from 'next/image'
import {getProviders, signIn, signOut, useSession} from "next-auth/react";
import {useRouter, useSearchParams} from "next/navigation";
import Script from 'next/script'
import {usePathname} from 'next/navigation'
//import LoaderHTML from 'src/components/Loader/LoaderHtml.js';
import {MoonLoader} from 'react-spinners'
import {displayContent} from "next/dist/client/dev/fouc";
// import '@tanstack/react-table'
// import {useReactTable} from '@tanstack/react-table'

import LoadingScreen from "src/components/LoadingScreen/LoadingScreen.js";

export default function Edit({params}) {

    console.log('Before:', params.user)
    const paramsUser_edit2 = params.user;
    // const paramsUser_edit2 = decodeURI(params.user);
    console.log('After (paramsUser_edit2):', paramsUser_edit2)

    const session = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const [dataFromAPI, setDataFromAPI] = useState('')
    const [showMe, setShowMe] = useState(false);
    const [showErrorUsername, setShowErrorUsername] = useState(false);
    const [slugUsername, setSlugUsername] = useState('');
    // const [user]

    const [admin, setAdmin] = useState(false);

    const [visible, setVisible] = useState(false);
    const [dataFromAPIInfo, setDataFromAPIInfo] = useState('');

    let [userdata, setuserData] = useState([]);

    useEffect(() => {
        console.log('history.state ', history.state, ' and ', 'location.pathname ', location.pathname)
        window.history.replaceState(window.history.state, '', location.pathname.toLowerCase())
        // const split = location.pathname.split('/');
        // const usr = paramsUser_edit2.toLowerCase()
        //     .replace(/[^a-z0-9-]/g, '-')
        // ;


        // console.log('usr ', usr, 'history.state ', history.state, ' and ', 'location.pathname ', location.pathname)
        // window.history.replaceState(window.history.state, '', '/users/edit/' + usr)
        // alert('history.state ' + history.state + ' and ' + 'location.pathname ' + location.pathname)

        // if (pathname !== pathname.toLowerCase()) {
        //     router.push(pathname.toLowerCase())
        // }

        // console.log('pathname ', pathname)
        console.log('session: ', session)
        if (session.status === "unauthenticated") {
            router?.push("/login");
        }

        if (session.data !== undefined) {
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
                    'slug_user': params.user,
                })
            });
            const dataPOSTUsr = await response;

            console.log('response ', response.url)


            if (response.url.includes(`/${params.user}`)) {
                console.log('Correct User.')
            } else {
                console.log(response.url);
                // window.location = response.url;
                router?.push(response.url);
            }

            // setDataFromAPI(dataPOSTUsr)
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
                    'slug_user': params.user,
                })
            });
            const dataPOSTUsrView = await responseUsrView.json();
            // const dataPOSTUsrViewJSON = await responseUsrView.json()

            console.log('responserrrr ', dataPOSTUsrView)
            // console.log('response json ', dataPOSTUsrViewJSON)

            setDataFromAPI(dataPOSTUsrView.username);
            setSlugUsername(dataPOSTUsrView.username);
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

    async function handleClickDeleteUser() {
        console.log('clickedddd delete')

        let respPOSTDelete = await fetch('/api/delete_user/', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                'slug_user': paramsUser_edit2,
            })
        });

        const dataDelete = await respPOSTDelete;

        if (dataDelete.url.includes(`/users`)) {
            router?.push(dataDelete.url);
        }

        console.log(dataDelete);

    }

    async function handleClickUpdateUser(e) {
        e.preventDefault();
        console.log('clickedddd update')
        console.log('usernam ', slugUsername)
        console.log('admin ', admin)

        function containsSpecialChars(str) {
            const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
            return specialChars.test(str);
        }

        if (containsSpecialChars(slugUsername)) {
            console.log('Error, username contains special characters!')
            setShowErrorUsername(true);
        } else {

            let respPOSTUpdate = await fetch('/api/update_user/', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    'slug_user': paramsUser_edit2,
                    'username': slugUsername,
                    'is_admin': admin,
                })
            });

            const dataUpdate = await respPOSTUpdate;
            console.log('update_user usrlll= ', dataUpdate.url);

            if (dataUpdate.url.includes(`/view`)) {
                router?.push(dataUpdate.url);
            } else if (dataUpdate.url.includes(`/edit`)) {
                console.log('Username taken!')
            }
        }
    }

    const togglePassword = () => {
        setVisible(!visible);
    };


    if (session.data.user.role_id === 'admin') {

        return (

            <>
                <div className="container row">

                    <div className="col min-vh-100 p-4">

                        <div className="card mb-3">
                            <div className="card-header">
                                <h5 className="mb-0">Edit User {dataFromAPI}:</h5>
                            </div>
                            <div className="card-body bg-light">

                                <form autoComplete="off" onSubmit={handleClickUpdateUser}
                                      className="row g-3">
                                    <div className="col-lg-6">
                                        <label className="form-label"
                                               htmlFor="first-name">Username</label>
                                        <input className="form-control" required id="first-name"
                                               type="text"
                                               placeholder={paramsUser_edit2}
                                               value={slugUsername}
                                               onChange={({target}) =>
                                                   setSlugUsername(target?.value)
                                               }/>

                                        <div style={{
                                            display: showErrorUsername ? "none" : "block"
                                        }}>
                                            <div id="usernameHelpBlock" className="form-text">
                                                Username must not contain special characters.
                                            </div>
                                        </div>

                                        <div style={{
                                            display: showErrorUsername ? "block" : "none"
                                        }}>
                                            <div className="form-text text-danger">
                                                Username contains special characters!
                                            </div>
                                        </div>

                                    </div>
                                    <div className="col-lg-6">

                                    </div>

                                    <div
                                        className="form-check col-lg-6 d-flex justify-content-start align-items-end m-0 mt-3 ps-2">

                                        <label className="form-check-label me-4 mb-0"
                                               htmlFor="userSettings1"><h5 className="m-0">Is the user
                                            an admin?</h5>
                                        </label>
                                        <input className="form-check-input mb-1" type="checkbox"
                                               id="userSettings1"
                                               value={admin}
                                               onChange={({target}) =>
                                                   setAdmin(!admin)
                                               }/>

                                    </div>

                                    <div className="col-lg-6">

                                    </div>

                                    <div className="col-6 d-flex justify-content-start">
                                        <button className="btn btn-danger" type="button"
                                                onClick={
                                                    handleClickDeleteUser
                                                }
                                        >Delete User
                                        </button>
                                    </div>
                                    <div className="col-6 d-flex justify-content-end">

                                        <a className="btn btn-outline-warning me-1"
                                           href={`/users/password/${paramsUser_edit2}`} role="button">

                                            <div
                                                className="fas fa-pen mb-1"
                                                data-fa-transform="shrink-3 down-2"></div>
                                            <div
                                                className="d-none d-sm-inline-block m-0 ms-1 h6">Change
                                                Password
                                            </div>
                                        </a>

                                        <button className="btn btn-primary" type="submit">Update User
                                        </button>
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