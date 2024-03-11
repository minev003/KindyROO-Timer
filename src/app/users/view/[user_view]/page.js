'use client';

import {useEffect, useState} from "react";
import {useSession} from "next-auth/react";
import {useRouter} from "next/navigation";

export default function View({params}) {
    const session = useSession();
    const router = useRouter();
    const [dataFromAPI, setDataFromAPI] = useState('')
    const paramsUser_view2 = (params.user_view).toLowerCase();

    const [editUserButton, setEditUserButton] = useState(false);

    useEffect(() => {
        console.log('history.state ', history.state, ' and ', 'location.pathname ', location.pathname)
        window.history.replaceState(window.history.state, '', location.pathname.toLowerCase())


        if (session.data !== undefined) {
            if (session.data.user.role_id !== 'admin') {
                router?.push("/");
            }

            let rights_ids = session.data.user.rights_ids;
            console.log('rights_array ', rights_ids);
            let edit_rights = false;

            for (let i = 0; i < rights_ids.length; i++) {
                //['create', 'read', 'update', 'delete']
                if (rights_ids[i] === 'update') {
                    edit_rights = true;
                }

            }

            if (edit_rights) {
                setEditUserButton(true)
            } else if (!edit_rights) {
                setEditUserButton(false)
            }

        }

//=============================================

        const fetchUsers2 = async () => {
            const response = await fetch('/api/dynrout/', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    'slug_user': paramsUser_view2,
                })
            });
            const dataPOSTUsr = await response;

            console.log('response ', response.url)


            if (response.url.includes(`/${paramsUser_view2}`)) {
                console.log('Correct User.')
            } else {
                console.log(response.url);
                // window.location = response.url;
                router?.push(response.url);
            }

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
                    'slug_user': paramsUser_view2,
                })
            });
            const dataPOSTUsrView = await responseUsrView.json();
            // const dataPOSTUsrViewJSON = await responseUsrView.json()

            console.log('responserrrr ', dataPOSTUsrView)
            // console.log('response json ', dataPOSTUsrViewJSON)

            setDataFromAPI(dataPOSTUsrView)
        };

        checkIfUserViewExists();


    }, [session, router]);




    if (session.data.user.role_id === 'admin') {
        return (
            <>

                <div className="container row">

                    <div className="col min-vh-100 p-4">

                        <div className="card mb-3">
                            <div className="card-header row g-3">
                                <div className="col-lg-6">
                                    <h5 className="mb-0">User {dataFromAPI.username} information: </h5>
                                </div>
                                <div
                                    className="col-lg-6 d-flex justify-content-end align-items-center mt-1">
                                    <a className="btn btn-falcon-default btn-sm mt-1"
                                       href={`/users/edit/${paramsUser_view2}`} role="button">

                                        <div
                                            className="fas fa-pen mb-1"
                                            data-fa-transform="shrink-3 down-2"></div>
                                        <div
                                            className="d-none d-sm-inline-block m-0 ms-1 h6">Edit User
                                        </div>
                                    </a>
                                </div>

                            </div>
                            <div className="card-body bg-light">
                                <h5 className="m-0 pb-1">Username: {dataFromAPI.username}</h5>
                                <h5 className="m-0 pb-1">Is the user an
                                    admin: {dataFromAPI.is_admin}</h5>
                                <h5 className="m-0 pb-1">User was created
                                    at: {dataFromAPI.created_at}</h5>
                            </div>
                        </div>
                    </div>
                </div>

            </>
        );
    }
}