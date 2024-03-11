'use client';

import {DotLoader} from "react-spinners";
import React from "react";
import 'bootstrap/dist/css/bootstrap.css'
import Script from 'next/script'

//<h1 className="h2 mb-3 fw-bold">Error Page :(</h1>

export default function ErrorPage() {

    return (

        <>
            <main className="main" id="top">
                <div className="container" data-layout="container">
                    <div className="row flex-center min-vh-100 py-6 text-center">
                        <div className="col-sm-10 col-md-8 col-lg-6 col-xxl-5">
                            <a className="d-flex flex-center mb-4" href="../../">
                                <img
                                    className="me-2"
                                    src="../../../assets/img/icons/spot-illustrations/rad.png"
                                    alt="radis"
                                    height="160"
                                    width="351"
                                />
                            </a>
                            <div className="card">
                                <div className="card-body p-4 p-sm-5">
                                    <div className="fw-black lh-1 text-300 fs-error">500</div>
                                    <p className="lead mt-4 text-800 font-sans-serif fw-semi-bold">
                                        Whoops, something went wrong!
                                    </p>
                                    <hr/>
                                    <p>
                                        Try refreshing the page, or going back and attempting the action
                                        again.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            {/* ===============================================*/}
            {/*    End of Main Content*/}
            {/* ===============================================*/}

        </>


    );
}