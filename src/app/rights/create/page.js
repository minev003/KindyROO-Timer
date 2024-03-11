'use client';

import 'bootstrap/dist/css/bootstrap.css'
import {useRouter} from "next/navigation";
import {useSession} from "next-auth/react";
import React, {useEffect, useState} from "react";

export default function Create({params}) {
    const session = useSession();
    const router = useRouter();
    const [showErrorRight, setShowErrorRight] = useState(false);
    const [rightname, setRightname] = useState('');
    const [rightrules, setRightrules] = useState('');
    const [rightdescr, setRightdescr] = useState('');

    // const [userpass, setUserpass] = useState('');
    // const [admin, setAdmin] = useState(false);
    let [roles, setRoles] = useState([]);
    let [rights, setRights] = useState([]);
    let data = [];

    let [userdata2, setuserData2] = useState([]);
    let data2 = [];
    let roles2 = [];

    // let data = [];
    let [chosenRole, setChosenRole] = useState('Select Rights');
    // let [chosenRights, setChosenRights] = useState('');
    useEffect(() => {

        async function fetchRoleAndRightsInfo() {
            //console.log('Making post request');
            let resp = await fetch('/api/fetch_user_role_rights/');

            data = await resp.json();
            //console.log('===============FETCH USER ROLE RIGHTS API RESULTS===============')
            // console.log('data ', data)
            // console.log('typeof data', typeof data);
            // console.log('data.roles_result ', data.roles_result)
            // console.log('data.rights_result ', data.rights_result)
            // setRoles(data.roles_result);
            setRights(data.rights_result);
            //console.log('===============FETCH USER ROLE RIGHTS API RESULTS===============')
        }

        fetchRoleAndRightsInfo();

        // async function fetchUsers2() {
        //     // console.log('Making raspberry get request');
        //     console.log('=====================================>');
        //
        //     let resp = await fetch('/api/roles/');
        //
        //     data2 = await resp.json();
        //     console.log('data2 ', data2)
        //     for (let i = 0; i < data2.length; i++) {
        //
        //         console.log('=====================================>');
        //
        //         roles2.push(data2[i].role_name);
        //         console.log(`data2[${i}] `, data2[i])
        //         console.log(`data2[${i}].role_name `, data2[i].role_name)
        //         console.log(`data2[${i}].rights_name `, data2[i].rights_name)
        //         console.log(`(data2[${i}].rights_name).length `, (data2[i].rights_name).length)
        //
        //         if ((data2[i].rights_name).length) {
        //
        //             for (let p = 0; p < (data2[i].rights_name).length; p++) {
        //                 console.log('p ', p)
        //                 console.log('(data2[i].rights_name)[p] ', (data2[i].rights_name)[p])
        //                 // console.log('data2[p].rights_name)[p].length', data2[p].rights_name)[p].length)
        //
        //                 if (p !== ((data2[i].rights_name).length - 1)) {
        //                     (data2[i].rights_name)[p] = (data2[i].rights_name)[p] + ', ';
        //                 } else {
        //                     //
        //                 }
        //
        //             }
        //             console.log('userdata2 after for ', userdata2)
        //
        //         } else {
        //
        //             console.log('````````````````` went here```````````````````')
        //             data2[i].rights_name[0] = 'No rights yet!';
        //
        //         }
        //
        //     }
        //     console.log('roles2 after for ', roles2);
        //     console.log('=====================================>');
        //
        //     setRoles(roles2);
        //     setuserData2(data2);
        // }
        //
        // fetchUsers2();
        // if(session.data.user.role_id === 'admin')

        // setTimeout(() => setIsLoading(false), 5000)


    }, [session, router]);

    // function choosenRole(userInfo) {
    //     let userInfo1 = userInfo
    //     console.log('setChosenRole(userInfo1) - userInfo1 ', userInfo1)
    //     setChosenRole(userInfo1);
    //     // console.log('userInfo ', userInfo1)
    //     //
    //     // console.log('userdata2 ', userdata2)
    //
    //     // for (let i = 0; i < userdata2.length; i++) {
    //     //
    //     //     // console.log('userdata2[i] ', userdata2[i])
    //     //     // console.log('userdata2[i].role_name ', userdata2[i].role_name)
    //     //     // console.log('userdata2[i].rights_name ', userdata2[i].rights_name)
    //     //     // console.log('chosenRole ', chosenRole)
    //     //
    //     //     // if (userdata2[i].role_name === userInfo1) {
    //     //     //     // console.log('INSIDEEEE')
    //     //     //     // console.log('userdata2[i].rights_name INSIDE ', userdata2[i].rights_name)
    //     //     //     console.log('userdata2[i].rights_name ', userdata2[i].rights_name)
    //     //     //     setRights(userdata2[i].rights_name);
    //     //     // }
    //     // }
    //     // console.log('rightsss ', rights)
    //     // console.log('chosenRole ', chosenRole)
    //     console.log('=====================================>');
    // }

    async function handleClickCreateUser(e) {
        e.preventDefault();
        console.log('=====================================>');
        console.log('rightname ',rightname)
        console.log('rightdescr ',rightdescr)
        console.log('rightrules ',rightrules)
        console.log('=====================================>');

        function containsSpecialChars(str) {
            const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
            return specialChars.test(str);
        }

        if (containsSpecialChars(rightname)) {
            setShowErrorRight(true);
        } else {

            let respPOSTCreateUser = await fetch('/api/create_right/', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    'rights_name': rightname,
                    'rights_description': rightdescr,
                    'rights_rules': rightrules,
                })
            });

            const dataCreateResponse = await respPOSTCreateUser.json();

            console.log('dataCreateResponse ', dataCreateResponse)
            // if (dataCreateResponse === 'Right created!') {
            //     router.push(`view/${rightname}`)
            //     console.log(dataCreateResponse)
            // } else {
            //     console.log(dataCreateResponse)
            // }

        }
        console.log('=====================================>');
    }

    if (session.data.user.role_id === 'admin') {
        return (
            <>
                <div className="container row">
                    <div className="col min-vh-100 p-4">
                        <div className="card mb-3">
                            <div className="card-header">
                                <h5 className="mb-0">Create New Right:</h5>
                            </div>
                            <div className="card-body bg-light">

                                <form autoComplete="off" onSubmit={handleClickCreateUser}
                                      className="row g-3">

                                    <div className="col-lg-6">
                                        <label className="form-label"
                                               htmlFor="first-name">Right Name: </label>
                                        <input className="form-control" required id="first-name"
                                               type="text" aria-describedby="usernameHelpBlock"
                                               placeholder="New Right name"
                                               value={rightname}
                                               onChange={({target}) =>
                                                   setRightname(target?.value)
                                               }/>

                                        <div style={{
                                            display: showErrorRight ? "none" : "block"
                                        }}>
                                            <div id="usernameHelpBlock" className="form-text">
                                                Right name must not contain special characters.
                                            </div>
                                        </div>

                                        <div style={{
                                            display: showErrorRight ? "block" : "none"
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
                                                   value={rightrules}
                                                   onChange={({target}) =>
                                                       setRightrules(target?.value)
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
                                                      value={rightdescr}
                                                      onChange={({target}) =>
                                                          setRightdescr(target?.value)
                                                      }
                                                      rows="5"></textarea>
                                        </div>

                                    </div>

                                    <div className="col-6 d-flex justify-content-start">
                                        <button className="btn btn-primary btn-xs" type="submit">Create New
                                            Right
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        <div className="modal fade" id="error-modal" tabIndex="-1" role="dialog"
                             aria-hidden="false">
                            <div className="modal-dialog modal-dialog-centered" role="document"
                                 style={{maxWidth: 500 + 'px'}}>
                                <div className="modal-content position-relative">
                                    <div className="position-absolute top-0 end-0 mt-2 me-2 z-1">
                                        <button
                                            className="btn-close btn btn-sm btn-circle d-flex flex-center transition-base"
                                            data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div className="modal-body p-0">
                                        <div className="rounded-top-3 py-3 ps-4 pe-6 bg-light">
                                            <h4 className="mb-1" id="modalExampleDemoLabel">Add a
                                                new illustration </h4>
                                        </div>
                                        <div className="p-4 pb-0">
                                            hi
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button className="btn btn-secondary" type="button"
                                                data-bs-dismiss="modal">Close
                                        </button>
                                        <button className="btn btn-primary"
                                                type="button">Understood
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </>
        );
    }
}


// <button className="btn btn-primary" type="button" data-bs-toggle="modal"
//         data-bs-target="#error-modal1">Launch modal
// </button>
// <div className="modal fade" id="error-modal1" tabIndex="-1" role="dialog"
//      aria-hidden="true">
//     <div className="modal-dialog modal-dialog-centered" role="document"
//          style={{maxWidth: 500 + 'px'}}>
//         <div className="modal-content position-relative">
//             <div className="position-absolute top-0 end-0 mt-2 me-2 z-1">
//                 <button
//                     className="btn-close btn btn-sm btn-circle d-flex flex-center transition-base"
//                     data-bs-dismiss="modal" aria-label="Close"></button>
//             </div>
//             <div className="modal-body p-0">
//                 <div className="rounded-top-3 py-3 ps-4 pe-6 bg-light">
//                     <h4 className="mb-1" id="modalExampleDemoLabel">Add a
//                         new illustration </h4>
//                 </div>
//                 <div className="p-4 pb-0">
//                     hi
//                 </div>
//             </div>
//             <div className="modal-footer">
//                 <button className="btn btn-secondary" type="button"
//                         data-bs-dismiss="modal">Close
//                 </button>
//                 <button className="btn btn-primary"
//                         type="button">Understood
//                 </button>
//             </div>
//         </div>
//     </div>
// </div>

// <label className="form-label">Choose User Role:</label>
// <br/>
// <div className="btn-group">
//     <button className="btn dropdown-toggle mb-2 btn-primary" type="button"
//             data-bs-toggle="dropdown" aria-haspopup="true"
//             aria-expanded="false">Select Role
//     </button>
//     <div className="dropdown-menu">
//         <a className="dropdown-item button" href="#">Role 1</a>
//         <a className="dropdown-item" href="#">Role 2</a>
//         <a className="dropdown-item" href="#">Role 3</a>
//         <div className="dropdown-divider"></div>
//         {/*<a className="dropdown-item" href="#">+ New User Role</a>*/}
//
//
//         <a className="dropdown-item" href="#" data-bs-toggle="modal"
//            data-bs-target="#error-modal">+ New User Role
//         </a>
//
//     </div>
// </div>

// <label className="form-label">Role Rights:</label>
// <br/>
// <div className="btn-group">
//     <button type="button" className="btn dropdown-toggle mb-2 btn-primary"
//             data-bs-toggle="dropdown" aria-haspopup="true"
//             aria-expanded="false">Select Rights
//     </button>
//     <div className="dropdown-menu">
//
//         {rights.map((userInfo, idx) => {
//             return (
//
//                 <button type="button" className="dropdown-item"
//                         key={userInfo + '-' + idx}>
//                     {userInfo}
//                     <input className="form-check-input m-1" type="checkbox"
//                            id={'userSettings' + idx}
//                            value={admin}
//                            onChange={({target}) =>
//                                setAdmin(!admin)
//                            }/>
//                 </button>
//             )
//         })}
//     </div>
// </div>

