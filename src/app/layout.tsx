'use client'
import './globals.css'
import 'bootstrap/dist/css/bootstrap.css'

import {Inter} from 'next/font/google'

import React, {Suspense} from "react";
import SideNav from "@/components/SideNav"
import Script from "next/script";
import LoadingScreen from "@/components/LoadingScreen/LoadingScreen";

const inter = Inter({subsets: ['latin']})


export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {

    return (
        <html lang="en">
        <head>
            <title>Radis Manager</title>
            <link rel="icon" type="image/png" sizes="32x32" href="/assets/img/favicons/favicon-32x32.png"/>
            <link rel="icon" type="image/png" sizes="16x16" href="/assets/img/favicons/favicon-16x16.png"/>
            <link rel="shortcut icon" type="image/x-icon" href="/assets/img/favicons/favicon.ico"/>
            <link rel="manifest" href="/assets/img/favicons/manifest.json"/>
            <meta name="msapplication-TileImage" content="assets/img/favicons/mstile-150x150.png"/>
            <meta name="theme-color" content="#ffffff"/>

            <script src="/assets/js/config.js"></script>
            <script src="/vendors/simplebar/simplebar.min.js"></script>

            <link rel="preconnect" href="https://fonts.gstatic.com"/>
            <link
                href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,500,600,700%7cPoppins:300,400,500,600,700,800,900&amp;display=swap"
                rel="stylesheet"/>

            <link href="/assets/css/theme-rtl.css" rel="stylesheet" id="style-rtl"/>
            <link href="/vendors/simplebar/simplebar.min.css" rel="stylesheet"/>
            <link href="/assets/css/theme.css" rel="stylesheet" id="style-default"/>
            <link href="/assets/css/user-rtl.css" rel="stylesheet" id="user-style-rtl"/>
            <link href="/assets/css/user.css" rel="stylesheet" id="user-style-default"/>

            <script src="/vendors/jquery/jquery.min.js"></script>
            <script src="/vendors/prism/prism.js"></script>
            <script src="/vendors/select2/select2.min.js"></script>
            <script src="/vendors/select2/select2.full.min.js"></script>
            <script src="/vendors/datatables.net/jquery.dataTables.min.js"></script>
            <script src="/vendors/datatables.net-bs5/dataTables.bootstrap5.min.js"></script>
            <script src="/vendors/datatables.net-fixedcolumns/dataTables.fixedColumns.min.js"></script>
            <script src="/vendors/prism/prism.js"></script>
        </head>
        <body className={inter.className}>
        <Suspense fallback={<LoadingScreen/>}>



                    <Script id="show-banner1">
                        {`
                        console.log('show-banner1 work')
                        var isRTL = JSON.parse(localStorage.getItem('isRTL'));
                    if (isRTL) {
                        var linkDefault = document.getElementById('style-default');
                        var userLinkDefault = document.getElementById('user-style-default');
                        linkDefault.setAttribute('disabled', true);
                        userLinkDefault.setAttribute('disabled', true);
                        document.querySelector('html').setAttribute('dir', 'rtl');
                    } else {
                        var linkRTL = document.getElementById('style-rtl');
                        var userLinkRTL = document.getElementById('user-style-rtl');
                        linkRTL.setAttribute('disabled', true);
                        userLinkRTL.setAttribute('disabled', true);
                    }`
                        }
                    </Script>

                    <main className="main" id="top">

                        <div className="container" data-layout="container">
                            <Script id="show-banner2">
                                {`
                                console.log('show-banner2 work')
                            var isFluid = JSON.parse(localStorage.getItem('isFluid'));
                            if (isFluid) {
                                var container = document.querySelector('[data-layout]');
                                container.classList.remove('container');
                                container.classList.add('container-fluid');
                            }`
                                }
                            </Script>
                            <SideNav/>

                            <div className="content">
                                {children}
                            </div>
                        </div>

                    </main>



        </Suspense>

        <script src="/vendors/popper/popper.min.js"></script>
        <script src="/vendors/bootstrap/bootstrap.min.js"></script>
        <script src="/vendors/anchorjs/anchor.min.js"></script>
        <script src="/vendors/is/is.min.js"></script>
        <script src="/vendors/echarts/echarts.min.js"></script>
        <script src="/vendors/fontawesome/all.min.js"></script>
        <script src="/vendors/lodash/lodash.min.js"></script>
        <script src="https://polyfill.io/v3/polyfill.min.js?features=window.scroll"></script>
        <script src="/vendors/list.js/list.min.js"></script>
        <script src="/assets/js/theme.js"></script>

        </body>
        </html>
    )
}
