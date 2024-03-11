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

    //console.log('Before:', params.role_edit)
    const paramsRole_edit2 = params.role_edit;
    // const paramsRole_edit2 = decodeURI(params.role_edit);
    //console.log('After (paramsRole_edit2):', paramsRole_edit2)

    const session = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const [dataFromAPI, setDataFromAPI] = useState('')
    const [showMe, setShowMe] = useState(false);
    const [showErrorRoleName, setShowErrorRoleName] = useState(false);
    const [slugRoleName, setSlugRoleName] = useState('');
    // const [role_edit]
    const [showErrorRights, setShowErrorRights] = useState(false);
    const [admin, setAdmin] = useState(false);

    const [visible, setVisible] = useState(false);
    const [rightsNames, setRightsNames] = useState([]);

    let [userdata, setuserData] = useState([]);

    useEffect(() => {
        //console.log('history.state ', history.state, ' and ', 'location.pathname ', location.pathname)
        window.history.replaceState(window.history.state, '', location.pathname.toLowerCase())
        // const split = location.pathname.split('/');
        // const usr = paramsRole_edit2.toLowerCase()
        //     .replace(/[^a-z0-9-]/g, '-')
        // ;


        // console.log('usr ', usr, 'history.state ', history.state, ' and ', 'location.pathname ', location.pathname)
        // window.history.replaceState(window.history.state, '', '/users/edit/' + usr)
        // alert('history.state ' + history.state + ' and ' + 'location.pathname ' + location.pathname)

        // if (pathname !== pathname.toLowerCase()) {
        //     router.push(pathname.toLowerCase())
        // }

        // console.log('pathname ', pathname)
        //console.log('session: ', session)
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
            const response = await fetch('/api/dynrout_role_check/', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    'slug_role': params.role_edit,
                })
            });
            const dataPOSTUsr = await response;

            //console.log('response ', response.url)


            if (response.url.includes(`/${params.role_edit}`)) {
                console.log('Correct Role.')
            } else {
                //console.log(response.url);
                // window.location = response.url;
                router?.push(response.url);
            }

            // setDataFromAPI(dataPOSTUsr)
        };

        fetchUsers2();

        //=============================================

        const checkIfUserViewExists = async () => {
            let responseUsrView = await fetch('/api/view_role/', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    'slug_role': params.role_edit,
                })
            });
            const dataPOSTRoleView = await responseUsrView.json();
            // const dataPOSTUsrViewJSON = await responseUsrView.json()

            //console.log('responserrrr(role_edittt) ', dataPOSTRoleView)
            // console.log('response json ', dataPOSTUsrViewJSON)

            //---------------------------------------------------------------------
            setDataFromAPI(dataPOSTRoleView.role_name);
            setSlugRoleName(dataPOSTRoleView.role_name);
            setRightsNames(dataPOSTRoleView.all_rights_name);
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

    async function handleClickDeleteRole() {
        console.log('clickedddd delete')

        let respPOSTDelete = await fetch('/api/delete_role/', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                'slug_role': paramsRole_edit2,
            })
        });

        const dataDelete = await respPOSTDelete;

        if (dataDelete.url.includes(`/roles`)) {
            router?.push(dataDelete.url);
        }
        //console.log(dataDelete);
    }

    async function handleClickUpdateRole(e) {
        e.preventDefault();
        console.log('clickedddd update')
        //console.log('slugRoleName ', slugRoleName)
        //console.log('admin ', admin)

        var checkedString = [];
        for (var i = 0; i < rightsNames.length; i++) {
            var element = $('.checkbox :checkbox')[i];
            if (element.checked) {
                //console.log('element.value ', element.value)
                checkedString.push(element.value)
            }
        }

        //console.log('checkedString (after for cikul) = ', checkedString);
        //console.log('checkedString.length (after for cikul) = ', checkedString.length);

        if ((checkedString.length) === 0) {
            setShowErrorRights(true)
        } else {

            function containsSpecialChars(str) {
                const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
                return specialChars.test(str);
            }

            if (containsSpecialChars(slugRoleName)) {
                console.log('Error, role name contains special characters!')
                setShowErrorRoleName(true);
            } else {

                console.log('went into ELSE')

                let respPOSTUpdate = await fetch('/api/update_role/', {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        'role_slug': paramsRole_edit2,
                        'role_name': slugRoleName,
                        'role_rights_array': checkedString,
                    })
                });

                const dataUpdate = await respPOSTUpdate.json();
                //console.log('dataUpdate ', dataUpdate);
                // console.log('update_user usrlll= ', dataUpdate.url);

                // if (dataUpdate.url.includes(`/view`)) {
                //     router?.push(dataUpdate.url);
                // } else if (dataUpdate.url.includes(`/edit`)) {
                //     console.log('Role taken!')
                // }

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
                                <h5 className="mb-0">Edit role {dataFromAPI}:</h5>
                            </div>
                            <div className="card-body bg-light">

                                <form autoComplete="off" onSubmit={handleClickUpdateRole}
                                      className="row g-3">
                                    <div className="col-lg-6">
                                        <label className="form-label"
                                               htmlFor="first-name">Role name</label>
                                        <input className="form-control" required id="first-name"
                                               type="text"
                                               placeholder={paramsRole_edit2}
                                               value={slugRoleName}
                                               onChange={({target}) =>
                                                   setSlugRoleName(target?.value)
                                               }/>

                                        <div style={{
                                            display: showErrorRoleName ? "none" : "block"
                                        }}>
                                            <div id="usernameHelpBlock" className="form-text">
                                                Role name must not contain special characters.
                                            </div>
                                        </div>

                                        <div style={{
                                            display: showErrorRoleName ? "block" : "none"
                                        }}>
                                            <div className="form-text text-danger">
                                                Role name contains special characters!
                                            </div>
                                        </div>

                                    </div>

                                    <div
                                        className="form-check col-lg-6">

                                        <label className="form-label">Role Rights:</label>
                                        <br/>
                                        <div className="btn-group">
                                            <button type="button" className="btn dropdown-toggle mb-2 btn-primary"
                                                    data-bs-toggle="dropdown" aria-haspopup="true"
                                                    aria-expanded="false">Select Rights
                                            </button>
                                            <div className="dropdown-menu">

                                                {rightsNames.map((userInfo, idx) => {
                                                    return (

                                                        <div className="dropdown-item checkbox"
                                                             key={userInfo + '-' + idx}>
                                                            {userInfo}
                                                            <input className="form-check-input m-1" type="checkbox"
                                                                   id={'userSettings' + idx}
                                                                   value={userInfo}/>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>

                                        <div style={{
                                            display: showErrorRights ? "block" : "none"
                                        }}>
                                            <div className="form-text text-danger">
                                                Please choose role rights!
                                            </div>
                                        </div>


                                    </div>

                                    <div className="col-6 d-flex justify-content-start">
                                        <button className="btn btn-danger" type="button"
                                                onClick={
                                                    handleClickDeleteRole
                                                }
                                        >Delete Role
                                        </button>
                                    </div>
                                    <div className="col-6 d-flex justify-content-end">

                                        <button className="btn btn-primary" type="submit">Update Role
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