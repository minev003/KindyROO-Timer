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

    const paramsRight_edit2 = params.right_edit;

    const session = useSession();
    const router = useRouter();
    // const pathname = usePathname();
    const [showMe, setShowMe] = useState(false);
    const [showErrorRoleName, setShowErrorRoleName] = useState(false);
    const [slugRightName, setSlugRightName] = useState('');
    const [slugRightDesc, setSlugRightDesc] = useState('');
    const [slugRightRule, setSlugRightRule] = useState('');

    // const [visible, setVisible] = useState(false);
    // const [rightsNames, setRightsNames] = useState([]);

    let [userdata, setuserData] = useState([]);

    useEffect(() => {

        window.history.replaceState(window.history.state, '', location.pathname.toLowerCase())

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
            const response = await fetch('/api/dynrout_right_check/', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    'slug_right': params.right_edit,
                })
            });
            const dataPOSTUsr = await response;

            if (response.url.includes(`/${params.right_edit}`)) {
                console.log('Correct Right.')
            } else {
                console.log(response.url);
                // window.location = response.url;
                // router?.push(response.url);
            }
            // setDataFromAPI(dataPOSTUsr)
        };
        fetchUsers2();

        //=============================================

        const checkIfUserViewExists = async () => {
            let responseUsrView = await fetch('/api/view_right/', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    'slug_right': params.right_edit,
                })
            });
            const dataPOSTRightView = await responseUsrView.json();
            // const dataPOSTUsrViewJSON = await responseUsrView.json()

            console.log('responserrrr(dataPOSTRightView for right_edittt) ', dataPOSTRightView)
            // console.log('response json ', dataPOSTUsrViewJSON)

            //---------------------------------------------------------------------

            setSlugRightName(dataPOSTRightView.rights_name);
            setSlugRightDesc(dataPOSTRightView.rights_description);
            setSlugRightRule(dataPOSTRightView.rights_rules);

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

    async function handleClickDeleteRight() {
        console.log('clickedddd delete')

        let respPOSTDelete = await fetch('/api/delete_right/', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                'slug_right': paramsRight_edit2,
            })
        });

        const dataDelete = await respPOSTDelete;

        if (dataDelete.url.includes(`/rights`)) {
            router?.push(dataDelete.url);
        }
        //console.log(dataDelete);
    }

    async function handleClickUpdateRight(e) {
        e.preventDefault();
        console.log('clickedddd update (right_edit)')
        //console.log('slugRoleName ', slugRoleName)
        //console.log('admin ', admin)

        function containsSpecialChars(str) {
            const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
            return specialChars.test(str);
        }

        if (containsSpecialChars(slugRightName)) {
            console.log('Error, right name contains special characters!')
            setShowErrorRoleName(true);
        } else {
            console.log('went into ELSE')

            let respPOSTUpdate = await fetch('/api/update_right/', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    'right_slug': params.right_edit,
                    'rights_name': slugRightName,
                    'rights_desc': slugRightDesc,
                    'rights_rule': slugRightRule,
                })
            });

            //   const [slugRightName, setSlugRightName] = useState('');
            //     const [slugRightDesc, setSlugRightDesc] = useState('');
            //     const [slugRightRule, setSlugRightRule] = useState('');

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
                                <h5 className="mb-0">Edit right "{paramsRight_edit2}":</h5>
                            </div>
                            <div className="card-body bg-light">

                                <form autoComplete="off" onSubmit={handleClickUpdateRight}
                                      className="row g-3">

                                    <div className="col-lg-6">
                                        <label className="form-label"
                                               htmlFor="first-name">Right Name: </label>
                                        <input className="form-control" required id="first-name"
                                               type="text" aria-describedby="usernameHelpBlock"
                                               placeholder="New Right name"
                                               value={slugRightName}
                                               onChange={({target}) =>
                                                   setSlugRightName(target?.value)
                                               }/>

                                        <div style={{
                                            display: showErrorRoleName ? "none" : "block"
                                        }}>
                                            <div id="usernameHelpBlock" className="form-text">
                                                Right name must not contain special characters.
                                            </div>
                                        </div>

                                        <div style={{
                                            display: showErrorRoleName ? "block" : "none"
                                        }}>
                                            <div className="form-text text-danger">
                                                Right name contains special characters!
                                            </div>
                                        </div>

                                        <div className="pt-2">

                                            <label className="form-label"
                                                   htmlFor="right-rules">Right Rule(s):</label>
                                            <input className="form-control" required id="right-rules"
                                                   type="text" aria-describedby="usernameHelpBlock"
                                                   placeholder="New right rule(s)"
                                                   value={slugRightRule}
                                                   onChange={({target}) =>
                                                       setSlugRightRule(target?.value)
                                                   }
                                            />

                                        </div>

                                    </div>

                                    <div className="col-lg-6">

                                        <div className="form-group">
                                            <label htmlFor="right-description">Right Decription: </label>
                                            <textarea className="form-control"
                                                      style={{resize: "none"}} maxLength="150"
                                                      required id="right-description"
                                                      type="text" aria-describedby="usernameHelpBlock"
                                                      placeholder="New right description"
                                                      value={slugRightDesc}
                                                      onChange={({target}) =>
                                                          setSlugRightDesc(target?.value)
                                                      }
                                                      rows="5"></textarea>
                                        </div>

                                    </div>

                                    <div className="col-6 d-flex justify-content-start">
                                        <button className="btn btn-danger" type="button"
                                                onClick={
                                                    handleClickDeleteRight
                                                }
                                        >Delete Right
                                        </button>
                                    </div>


                                    <div className="col-6 d-flex justify-content-end">

                                        <button className="btn btn-primary" type="submit">Update Right
                                        </button>
                                    </div>

                                </form>

                            </div>
                        </div>

                    </div>
                </div>

            </>

        )
            ;

    }
}