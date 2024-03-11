import {MoonLoader} from "react-spinners";
import React from "react";

export default function LoadingScreen() {
    return (
        <main className='main'>
            <div className="p-3">
                <div className="container container-fluid d-flex align-items-center flex-column p-5">
                    <div className="p-2">
                        <h3>Loading...</h3>
                    </div>

                    <div className="p-3">
                        <MoonLoader
                            color="#3676d6"
                            cssOverride={{}}
                            size={100}
                            speedMultiplier={0.5}
                        />
                    </div>

                </div>
            </div>
        </main>
    );
}