'use client';


import Link from 'next/link'
import React, {Suspense, useEffect, useState} from "react";
import Image from 'next/image'
import {getProviders, signIn, signOut, useSession} from "next-auth/react";
import {useRouter, useSearchParams} from "next/navigation";
import Script from 'next/script'
//import LoaderHTML from 'src/components/Loader/LoaderHtml.js';
import {MoonLoader} from 'react-spinners'
import {displayContent} from "next/dist/client/dev/fouc";
// import '@tanstack/react-table'
// import {useReactTable} from '@tanstack/react-table'
// import DataTable from 'react-data-table-component'
import LoadingScreen from "src/components/LoadingScreen/LoadingScreen.js";

import Header from "../../components/Header"


export default function UsersPage() {
    const session = useSession();
    const router = useRouter();
    let [userdata, setuserData] = useState([]);
    let [rawdata, setRawdata] = useState([]);
    let [isLoading, setIsLoading] = useState(true);
    let [userSlug, getUserSlug] = useState('');
    let data = [];
    // Buttons for create and Edit users
    const [createNewUserButton, setCreateNewUserButton] = useState(false);
    const [editUserButton, setEditUserButton] = useState(false);
    const [readUserButton, setReadUserButton] = useState(false);

    console.log('userdata ', userdata)

    if (userdata.length === 0) {
        console.log('userdata e nulaaa0')
    } else {
        console.log('userdata ne e nulla0 ')
    }

    useEffect(() => {

        if (session.data != undefined) {
            if (session.data.user.role_id !== 'admin') {
                router?.push("/");
            }

            let rights_ids = session.data.user.rights_ids;
            console.log('rights_array ', rights_ids);
            let create_rights = false;
            let edit_rights = false;
            let read_rights = false;
            let delete_rights = false;

            for (let i = 0; i < rights_ids.length; i++) {
                //['create', 'read', 'update', 'delete']
                if (rights_ids[i] === 'create') {
                    create_rights = true;
                } else if (rights_ids[i] === 'read') {
                    read_rights = true;
                } else if (rights_ids[i] === 'update') {
                    edit_rights = true;
                } else if (rights_ids[i] === 'delete') {
                    delete_rights = true;
                }

            }

            if (create_rights) {
                setCreateNewUserButton(true)
            } else if (!create_rights) {
                setCreateNewUserButton(false)
            }
            if (edit_rights) {
                setEditUserButton(true)
            } else if (!edit_rights) {
                setEditUserButton(false)
            }
            if (read_rights) {
                setReadUserButton(true)
            } else if (!read_rights) {
                setReadUserButton(false)
            }

        }

        async function fetchUsers() {
            console.log('Making raspberry get request');
            let resp = await fetch('/api/users_database_checkin/');

            data = await resp.json();
            setRawdata(data);
            console.log('data ', data)
            console.log('typeof data', typeof data[0]);
            setuserData(data);
        }

        fetchUsers();
        // if(session.data.user.role_id === 'admin')

        // setTimeout(() => setIsLoading(false), 5000)

    }, [session, router]);

    console.log('session: ', session)


    if (session.data.user.role_id === 'admin' && userdata.length > 0) {


        function myFunction() {
            var input, filter, table, tr, td, i, txtValue;
            let filtered_data = [];

            input = document.getElementById("myInput");
            filter = input.value.toUpperCase();
            console.log("FILTEER ", filter)
            console.log("DATA ", rawdata)
            //pravilno
            // table = document.getElementById("example987");
            // tr = table.getElementsByTagName("tr");

            for (i = 0; i < rawdata.length; i++) {
                const datum = rawdata[i];
                // td = tr[i].getElementsByTagName("td")[0];
                // if (td) {
                //     txtValue = td.textContent || td.innerText;

                let toUpCase = datum.username.toUpperCase();
                console.log('toUpCase.indexOf(filter) ', toUpCase.indexOf(filter))

                if (datum.username.toUpperCase().indexOf(filter) > -1) {
                    filtered_data.push(datum)

                }
                // }
            }
            console.log("FILTERED DATA: ", filtered_data)
            setuserData(filtered_data)
        }

        return (

            <>

                <div className="container">
                    <div className="card mb-3">
                        <div className="card-header p-0">
                            <div className="row w-100 m-0">
                                <div
                                    className="col-md-6 col-sm-auto ms-auto d-flex justify-content-start align-items-center ps-1 pt-1">
                                    <div id="table-simple-pagination-replace-element">

                                        <a style={{
                                            display: createNewUserButton ? "block" : "none"
                                        }}
                                           className="btn btn-falcon-default btn-sm m-1"
                                           href="/users/create" role="button">

                                                            <span
                                                                className="fas fa-plus"
                                                                data-fa-transform="shrink-3 down-2"></span><span
                                            className="d-none d-sm-inline-block ms-1">Create New User</span>
                                        </a>

                                        {/*<button className="btn btn-falcon-default btn-sm mx-2"*/}
                                        {/*        type="button"><span*/}
                                        {/*    className="fas fa-edit"*/}
                                        {/*    data-fa-transform="shrink-3 down-2"></span><span*/}
                                        {/*    className="d-none d-sm-inline-block ms-1">Edit</span>*/}
                                        {/*</button>*/}
                                        {/*<button className="btn btn-falcon-default btn-sm"*/}
                                        {/*        type="button"><span*/}
                                        {/*    className="fas fa-trash"*/}
                                        {/*    data-fa-transform="shrink-3 down-2"></span><span*/}
                                        {/*    className="d-none d-sm-inline-block ms-1">Delete</span>*/}
                                        {/*</button>*/}
                                    </div>
                                </div>
                                <div
                                    className="col-md-6 col-sm-auto ms-auto d-flex justify-content-end align-items-end ps-1 pe-1 pt-1">

                                    {/*<div className="input-group rounded">*/}
                                    {/*    <input type="text" id="myInput" className="form-control rounded"*/}
                                    {/*           onKeyUp={myFunction} placeholder="Search" aria-label="Search"*/}
                                    {/*           aria-describedby="search-addon"/>*/}
                                    {/*</div>*/}

                                </div>

                            </div>

                        </div>
                        <div className="card-body px-0 pt-1 pb-1">

                            <table id="example987"
                                   className="table table-striped table-hover mb-0 fs--1"
                                   style={{width: '100%'}}>

                                <thead className="bg-200 text-900">
                                <tr>
                                    <th className="sort">Username</th>
                                    <th className="sort">Created</th>
                                    <th className="sort">State</th>
                                    <th className="sort text-end">Action</th>
                                </tr>
                                </thead>
                                <tbody>

                                {userdata.map((userInfo, idx) => {
                                    return (
                                        <tr key={userInfo.username + '-' + idx}>
                                            <td>{userInfo.username}</td>
                                            <td>{userInfo.created_at}</td>
                                            <td>To be added</td>

                                            <td className="text-end align-middle white-space-nowrap position-relative">
                                                <div className="hover-actions bg-100">
                                                    <button
                                                        className="btn icon-item rounded-3 me-2 fs--2 icon-item-sm">
                                                                                    <span
                                                                                        className="far fa-edit"></span>
                                                    </button>
                                                    <button
                                                        className="btn icon-item rounded-3 me-2 fs--2 icon-item-sm">
                                                                                    <span
                                                                                        className="far fa-comment"></span>
                                                    </button>
                                                </div>
                                                <div
                                                    className="dropdown font-sans-serif btn-reveal-trigger">
                                                    <button
                                                        className="btn btn-link text-600 btn-sm dropdown-toggle dropdown-caret-none btn-reveal-sm transition-none"
                                                        type="button"
                                                        id="crm-recent-leads-0"
                                                        data-bs-toggle="dropdown"
                                                        data-boundary="viewport"
                                                        aria-haspopup="true"
                                                        aria-expanded="false"><span
                                                        className="fas fa-ellipsis-h fs--2"></span>
                                                    </button>
                                                    <div
                                                        className="dropdown-menu dropdown-menu-end border py-2"
                                                        aria-labelledby="crm-recent-leads-0">
                                                        <a style={{
                                                            display: readUserButton ? "block" : "none"
                                                        }}
                                                           className="dropdown-item"
                                                           href={`users/view/${userInfo.users_slug}`}>View</a>
                                                        <a style={{
                                                            display: editUserButton ? "block" : "none"
                                                        }}
                                                           className="dropdown-item"
                                                           href={`users/edit/${userInfo.users_slug}`}>Edit</a>

                                                    </div>
                                                </div>
                                            </td>

                                        </tr>
                                    )

                                })}

                                </tbody>
                            </table>

                        </div>
                    </div>
                </div>

                {/*key={Date.now()}*/}
                <Script id={`show-ba555nner5${(Math.round(Math.random() * 10000))}`} strategy="lazyOnload">
                    {`console.log('===============> example987 yeeei');
                $("#example987").DataTable({
                    dom: '<"top">rt <"bottom pt-1" <"row w-100 m-0"<"col-sm-12 col-md-4 ps-2 pt-3 align-items-center"i><"col-sm-12 col-md-4 p-2 align-items-center"p><"col-sm-12 col-md-4 p-2 d-flex justify-content-end align-items-center"l>>> <"clear">',


                });
                    `}
                </Script>

                {/*<"col-sm-12 pe-1"f>*/}

                {/*<div className="container mb-3">*/}
                {/*    <DataTable*/}
                {/*        columns={columns}*/}
                {/*        data={dataTab}*/}
                {/*        fixedHeader*/}
                {/*        pagination*/}

                {/*        selectableRows*/}
                {/*    >*/}
                {/*    </DataTable>*/}
                {/*</div>*/}

                {/*<div className="container mb-3">*/}
                {/*    <AdvanceTableWrapper*/}
                {/*        columns={columns}*/}
                {/*        data={data}*/}
                {/*        sortable*/}
                {/*        pagination*/}
                {/*        perPage={5}*/}
                {/*    >*/}
                {/*        <AdvanceTable*/}
                {/*            table*/}
                {/*            headerClassName="bg-200 text-900 text-nowrap align-middle"*/}
                {/*            rowClassName="align-middle white-space-nowrap"*/}
                {/*            tableProps={{*/}
                {/*                bordered: true,*/}
                {/*                striped: true,*/}
                {/*                className: 'fs--1 mb-0 overflow-hidden'*/}
                {/*            }}*/}
                {/*        />*/}
                {/*        <div className="mt-3">*/}
                {/*            <AdvanceTablePagination*/}
                {/*                table*/}
                {/*            />*/}
                {/*        </div>*/}
                {/*    </AdvanceTableWrapper>*/}
                {/*</div>*/}

                {/*<div className="card mb-3">*/}
                {/*    <div className="card-header p-0">*/}
                {/*    </div>*/}
                {/*    <div className="card-body px-0">*/}
                {/*        <div className="tab-content">*/}
                {/*            <div className="tab-pane preview-tab-pane active" role="tabpanel"*/}
                {/*                 aria-labelledby="tab-dom-1c776e2e-fb90-4797-9ac7-326e9448bccc"*/}
                {/*                 id="dom-1c776e2e-fb90-4797-9ac7-326e9448bccc">*/}
                {/*                <table id="testingthishs" className="table mb-0 data-table fs--1">*/}

                {/*                    <thead className="bg-200 text-800">*/}
                {/*                    <tr>*/}
                {/*                        <th className="sort align-middle"*/}
                {/*                            data-sort="name">Username*/}
                {/*                        </th>*/}
                {/*                        <th className="sort align-middle"*/}
                {/*                            data-sort="email">Created*/}
                {/*                        </th>*/}
                {/*                        <th className="sort align-middle"*/}
                {/*                            data-sort="status">State*/}
                {/*                        </th>*/}
                {/*                        <th className="sort align-middle text-end">Action</th>*/}
                {/*                    </tr>*/}
                {/*                    </thead>*/}


                {/*                    <tbody className="list" id="table-recent-leads-body">*/}

                {/*                    {userdata.map((userInfo) => {*/}
                {/*                        return (*/}

                {/*                            <tr key={userInfo.username}>*/}
                {/*                                <td>{userInfo.username}</td>*/}
                {/*                                <td>{userInfo.created_at}</td>*/}
                {/*                                <td>To be added</td>*/}
                {/*                                <td className="align-middle white-space-nowrap text-end position-relative">*/}
                {/*                                    <div className="hover-actions bg-100">*/}
                {/*                                        <button*/}
                {/*                                            className="btn icon-item rounded-3 me-2 fs--2 icon-item-sm">*/}
                {/*                                                        <span*/}
                {/*                                                            className="far fa-edit"></span>*/}
                {/*                                        </button>*/}
                {/*                                        <button*/}
                {/*                                            className="btn icon-item rounded-3 me-2 fs--2 icon-item-sm">*/}
                {/*                                                        <span*/}
                {/*                                                            className="far fa-comment"></span>*/}
                {/*                                        </button>*/}
                {/*                                    </div>*/}
                {/*                                    <div*/}
                {/*                                        className="dropdown font-sans-serif btn-reveal-trigger">*/}
                {/*                                        <button*/}
                {/*                                            className="btn btn-link text-600 btn-sm dropdown-toggle dropdown-caret-none btn-reveal-sm transition-none"*/}
                {/*                                            type="button"*/}
                {/*                                            id="crm-recent-leads-0"*/}
                {/*                                            data-bs-toggle="dropdown"*/}
                {/*                                            data-boundary="viewport"*/}
                {/*                                            aria-haspopup="true"*/}
                {/*                                            aria-expanded="false"><span*/}
                {/*                                            className="fas fa-ellipsis-h fs--2"></span>*/}
                {/*                                        </button>*/}
                {/*                                        <div*/}
                {/*                                            className="dropdown-menu dropdown-menu-end border py-2"*/}
                {/*                                            aria-labelledby="crm-recent-leads-0">*/}
                {/*                                            <a*/}
                {/*                                                className="dropdown-item"*/}
                {/*                                                href="#!">View</a><a*/}
                {/*                                            className="dropdown-item"*/}
                {/*                                            href="#!">Export</a>*/}
                {/*                                            <div*/}
                {/*                                                className="dropdown-divider"></div>*/}
                {/*                                            <a className="dropdown-item text-danger"*/}
                {/*                                               href="#!">Remove</a>*/}
                {/*                                        </div>*/}
                {/*                                    </div>*/}
                {/*                                </td>*/}

                {/*                            </tr>*/}

                {/*                        )*/}

                {/*                    })}*/}

                {/*                    </tbody>*/}

                {/*                </table>*/}


                {/*            </div>*/}
                {/*            <div className="tab-pane code-tab-pane" role="tabpanel"*/}
                {/*                 aria-labelledby="tab-dom-532074e3-b7aa-4217-8688-7442bee8bad4"*/}
                {/*                 id="dom-532074e3-b7aa-4217-8688-7442bee8bad4">*/}

                {/*            </div>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</div>*/}

                {/*<div className="row">*/}

                {/*    <div className="col min-vh-100 p-4">*/}

                {/*        <div className="row g-3">*/}

                {/*            <div className="col-lg-12">*/}
                {/*                <div className="card m3" id="TableCrmRecentLeads"*/}
                {/*                     data-list='{"valueNames":["name","email","status"],"page":10,"pagination":true}'>*/}

                {/*                    <div className="card-header p-3">*/}
                {/*                        <h5>He</h5>*/}
                {/*                    </div>*/}

                {/*                    <div className="card-body px-0 py-3">*/}

                {/*                        <div className="row mx-0">*/}
                {/*                            <div className="col-md-6 justify-content-start">*/}
                {/*                                <div className="dataTables_length"*/}
                {/*                                     id="DataTables_Table_0_length">*/}
                {/*                                    <label>Show <select*/}
                {/*                                        name="DataTables_Table_0_length"*/}
                {/*                                        aria-controls="DataTables_Table_0"*/}
                {/*                                        className="form-select form-select-sm">*/}
                {/*                                        <option value="10">10</option>*/}
                {/*                                        <option value="25">25</option>*/}
                {/*                                        <option value="50">50</option>*/}
                {/*                                        <option value="100">100</option>*/}
                {/*                                    </select> entries*/}
                {/*                                    </label></div>*/}
                {/*                            </div>*/}
                {/*                            <div className="col-md-6 justify-content-end">*/}
                {/*                                <div id="DataTables_Table_0_filter"*/}
                {/*                                     className="dataTables_filter"><label>Search:<input*/}
                {/*                                    type="search" className="form-control form-control-sm"*/}
                {/*                                    placeholder=""*/}
                {/*                                    aria-controls="DataTables_Table_0"/></label></div>*/}
                {/*                            </div>*/}
                {/*                        </div>*/}

                {/*                        <div className="table-responsive scrollbar">*/}
                {/*                            <table id="DataTables_Table_0" className="table fs--1 mb-0">*/}
                {/*                                <thead className="bg-200 text-800">*/}
                {/*                                <tr>*/}
                {/*                                    <th className="sort align-middle"*/}
                {/*                                        data-sort="name">Username*/}
                {/*                                    </th>*/}
                {/*                                    <th className="sort align-middle"*/}
                {/*                                        data-sort="email">Created*/}
                {/*                                    </th>*/}
                {/*                                    <th className="sort align-middle"*/}
                {/*                                        data-sort="status">State*/}
                {/*                                    </th>*/}
                {/*                                    <th className="sort align-middle text-end">Action</th>*/}
                {/*                                </tr>*/}
                {/*                                </thead>*/}
                {/*                                <tbody className="list" id="table-recent-leads-body">*/}

                {/*                                {userdata.map((userInfo) => {*/}
                {/*                                    return (*/}
                {/*                                        <tr key={userInfo.username}*/}
                {/*                                            className="hover-actions-trigger btn-reveal-trigger hover-bg-100">*/}
                {/*                                            <td className="align-middle white-space-nowrap">*/}
                {/*                                                <a*/}
                {/*                                                    className="text-800"*/}
                {/*                                                    href="../pages/user/profile.html">*/}
                {/*                                                    <div*/}
                {/*                                                        className="d-flex align-items-center">*/}
                {/*                                                        <h6 className="mb-0 ps-2 name">*/}
                {/*                                                            <div>{userInfo.username}</div>*/}
                {/*                                                        </h6>*/}
                {/*                                                    </div>*/}
                {/*                                                </a></td>*/}
                {/*                                            <td className="align-middle white-space-nowrap text-primary email">*/}
                {/*                                                <a*/}
                {/*                                                    href="#">*/}
                {/*                                                    <div>{userInfo.created_at}</div>*/}
                {/*                                                </a>*/}
                {/*                                            </td>*/}
                {/*                                            <td className="align-middle white-space-nowrap">*/}
                {/*                                                To be added*/}
                {/*                                            </td>*/}
                {/*                                            <td className="align-middle white-space-nowrap text-end position-relative">*/}
                {/*                                                <div className="hover-actions bg-100">*/}
                {/*                                                    <button*/}
                {/*                                                        className="btn icon-item rounded-3 me-2 fs--2 icon-item-sm">*/}
                {/*                                                        <span*/}
                {/*                                                            className="far fa-edit"></span>*/}
                {/*                                                    </button>*/}
                {/*                                                    <button*/}
                {/*                                                        className="btn icon-item rounded-3 me-2 fs--2 icon-item-sm">*/}
                {/*                                                        <span*/}
                {/*                                                            className="far fa-comment"></span>*/}
                {/*                                                    </button>*/}
                {/*                                                </div>*/}
                {/*                                                <div*/}
                {/*                                                    className="dropdown font-sans-serif btn-reveal-trigger">*/}
                {/*                                                    <button*/}
                {/*                                                        className="btn btn-link text-600 btn-sm dropdown-toggle dropdown-caret-none btn-reveal-sm transition-none"*/}
                {/*                                                        type="button"*/}
                {/*                                                        id="crm-recent-leads-0"*/}
                {/*                                                        data-bs-toggle="dropdown"*/}
                {/*                                                        data-boundary="viewport"*/}
                {/*                                                        aria-haspopup="true"*/}
                {/*                                                        aria-expanded="false"><span*/}
                {/*                                                        className="fas fa-ellipsis-h fs--2"></span>*/}
                {/*                                                    </button>*/}
                {/*                                                    <div*/}
                {/*                                                        className="dropdown-menu dropdown-menu-end border py-2"*/}
                {/*                                                        aria-labelledby="crm-recent-leads-0">*/}
                {/*                                                        <a*/}
                {/*                                                            className="dropdown-item"*/}
                {/*                                                            href="#!">View</a><a*/}
                {/*                                                        className="dropdown-item"*/}
                {/*                                                        href="#!">Export</a>*/}
                {/*                                                        <div*/}
                {/*                                                            className="dropdown-divider"></div>*/}
                {/*                                                        <a className="dropdown-item text-danger"*/}
                {/*                                                           href="#!">Remove</a>*/}
                {/*                                                    </div>*/}
                {/*                                                </div>*/}
                {/*                                            </td>*/}
                {/*                                        </tr>*/}
                {/*                                    )*/}

                {/*                                })}*/}

                {/*                                </tbody>*/}
                {/*                            </table>*/}
                {/*                        </div>*/}

                {/*                        <div className="d-flex justify-content-center my-3">*/}
                {/*                            <button className="btn btn-sm btn-falcon-default me-1"*/}
                {/*                                    type="button" title="Previous"*/}
                {/*                                    data-list-pagination="prev"><span*/}
                {/*                                className="fas fa-chevron-left"></span></button>*/}
                {/*                            <ul className="pagination mb-0"></ul>*/}
                {/*                            <button className="btn btn-sm btn-falcon-default ms-1"*/}
                {/*                                    type="button" title="Next" data-list-pagination="next">*/}
                {/*                                <span className="fas fa-chevron-right"></span></button>*/}
                {/*                        </div>*/}

                {/*                    </div>*/}
                {/*                    <div className="card-footer bg-light p-0">*/}
                {/*                        <div className="pagination d-none"></div>*/}
                {/*                    </div>*/}
                {/*                </div>*/}
                {/*            </div>*/}
                {/*        </div>*/}

                {/*    </div>*/}
                {/*</div>*/}


            </>

        );

    }
}
/*
<Script id="show-banner" strategy="lazyOnload">
                {`
                    (function()
                    {
                        if( window.localStorage )
                        {
                        if( !localStorage.getItem('firstLoad') )
                        {
                            localStorage['firstLoad'] = true;
                            window.location.reload();
                        }
                        else
                            localStorage.removeItem('firstLoad');
                        }
                    })();
                `}
            </Script>
*/
/*
<div className="row flex-between-center">
                                                            <div className='col-md-4'>
                                                                <button
                                                                    type="submit"
                                                                    name="submit"
                                                                    className="btn btn-primary w-100 mt-4"
                                                                >
                                                                    Log in
                                                                </button>
                                                            </div>

                                                            <div className='col-md-auto'>
                                                                <button
                                                                    onClick={
                                                                        handleClick
                                                                    }
                                                                    type="button"
                                                                    name="submit1"
                                                                    className="btn btn-link w-100 mt-4 pr-0"
                                                                >
                                                                    Forgot your password?
                                                                </button>
                                                            </div>
                                                        </div>
*/
