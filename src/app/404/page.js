'use client';

import {DotLoader} from "react-spinners";
import React from "react";
import 'bootstrap/dist/css/bootstrap.css'
import Script from "next/script";

//<h1 className="h2 mb-3 fw-bold">Error Page :(</h1>

export default function ErrorPage() {

    return (
        <>

            {/* ===============================================*/}
            {/*    Main Content*/}
            {/* ===============================================*/}
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
                                    <div className="fw-black lh-1 text-300 fs-error">404</div>
                                    <p className="lead mt-4 text-800 font-sans-serif fw-semi-bold w-md-75 w-xl-100 mx-auto">
                                        The page you're looking for is not found.
                                    </p>
                                    <hr/>
                                    <p>
                                        Make sure the address is correct and that the page hasn't moved.
                                    </p>
                                    <a
                                        className="btn btn-primary btn-sm mt-3"
                                        href="../../"
                                    >
                                        <span className="fas fa-home me-2"/>
                                        Take me home
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            {/* ===============================================*/}
            {/*    End of Main Content*/}
            {/* ===============================================*/}
            <div
                className="offcanvas offcanvas-end settings-panel border-0"
                id="settings-offcanvas"
                tabIndex={-1}
                aria-labelledby="settings-offcanvas"
            >
                <div className="offcanvas-header settings-panel-header bg-shape">
                    <div className="z-1 py-1" data-bs-theme="light">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                            <h5 className="text-white mb-0 me-2">
                                <span className="fas fa-palette me-2 fs-0"/>
                                Settings
                            </h5>
                            <button
                                className="btn btn-primary btn-sm rounded-pill mt-0 mb-0"
                                data-theme-control="reset"
                                style={{fontSize: 12}}
                            >
                                {" "}
                                <span
                                    className="fas fa-redo-alt me-1"
                                    data-fa-transform="shrink-3"
                                />
                                Reset
                            </button>
                        </div>
                        <p className="mb-0 fs--1 text-white opacity-75">
                            {" "}
                            Set your own customized style
                        </p>
                    </div>
                    <button
                        className="btn-close btn-close-white z-1 mt-0"
                        type="button"
                        data-bs-dismiss="offcanvas"
                        aria-label="Close"
                    />
                </div>

            </div>



        </>

    );
}