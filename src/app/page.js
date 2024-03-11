'use client';
import React, {useState} from 'react';


export default function RedirectTestPage() {
    const [timer, setTimer] = useState('')
    const [timers, setTimers] = useState('')
    const [startAt, setStartAt] = useState('')
    const [endAt, setEndAt] = useState('')
    const [fl, setFl] = useState('')

    const startTimer = function (value) {
        console.log('start timer');
        var now = new Date()
        setTimer(value)
        setStartAt(now)
        setEndAt(new Date(now.getTime() + value * 60 * 1000));

        changeBorder('green');
        var step = value / 3;
        var temp = setTimeout(changeBorder, step * 60 * 1000, 'yellow', true);
        var temp2 = setTimeout(changeBorder, step * 2 * 60 * 1000, 'red', true);
        var temp3 = setTimeout(startFlashingRed, (value - 2) * 60 * 1000);
        var temp4 = setTimeout(stopTimer, value * 60 * 1000);

        setTimers([temp, temp2, temp3, temp4]);
    }

    function startFlashingRed() {
        ping();
        var flash = setInterval(() => {
            var playlist = $('#playlist')
            var currentColor = playlist.css('borderColor')
            changeBorder(currentColor === 'rgb(255, 0, 0)' ? 'rgb(255, 255, 255)' : 'rgb(255, 0, 0)')
        }, 2000);
        setFl(flash)
    }

    function stopTimer() {
        console.log('FL')
        console.log(fl)
        clearInterval(fl);
        setTimer('')

        for (let i = 0; i < timers.length; i++) {
            clearTimeout(timers[i]);
        }
        changeBorder('white');
    }

    function changeBorder(color, pin) {
        if (pin){
            ping()
        }
        $('#playlist').css('borderColor' , color);
    }
    function ping() {
        var audio = new Audio('ping.wav');
        audio.play();
    }
    function playFirst (){

        let childrens = document.getElementsByTagName('a');
        for (let i = 0; i < childrens.length; i++) {
            childrens[i].classList.remove("active","border","border-primary", "rounded");
        }

        var el = document.getElementById('PLAY-SESSION')?.children[1]?.children[0]?.children[0]?.children[1]
        console.log(el)


        el.parentElement.classList.add("active","border","border-primary", "rounded");


    var path = el.getAttribute('path')
        audio.src = '/audio/' + path;
        audio.play();
    $('#song').text(el.textContent)

    }


    return (
        <div className="row mt-6 position-fixed w-75">
            <div className="ms-6">

                {timer !== '' ? (
                    <>
                        <button type="button" id="stop" className="btn btn-outline-danger ms-2" onClick={stopTimer}>{'STOP ' + timer}</button>
                        <button type="button" id="play" className="btn btn-outline-success ms-2" onClick={playFirst}>PLAY</button>
                        <p>{startAt.getHours() + " : " + startAt.getMinutes() + "  /  "+ endAt.getHours() + " : " + endAt.getMinutes()}</p>
                    </>
                    ) : (
                        <>
                        <button type="button" id="start30" className="btn btn-outline-success ms-2" onClick={()=>startTimer(30)}>30</button>
                        <button type="button" id="start45" className="btn btn-outline-success ms-2" onClick={()=>startTimer(45)}>45</button>
                        </>
                    )
                }


            </div>
            <div className="col">
                <h3>KindyROO Player</h3>
                <h2 id='song'></h2>
                <div className="playerControls">
                    <audio id="audio" className="w-50" controls >
                        <source type="audio/mp3"/>
                            Your browser does not support the audio element.
                    </audio>
                </div>
            </div>
        </div>
    );
}
