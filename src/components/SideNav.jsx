'use client';

    import Script from 'next/script';
    var curEl = '';
    function handle_play(el) {
        let childrens = document.getElementsByTagName('a');
        for (let i = 0; i < childrens.length; i++) {
            childrens[i].classList.remove("active","border","border-primary", "rounded");
        }
        play_li(el);
        curEl = el;
        el.parentElement.classList.add("active","border","border-primary", "rounded");
    }

    function play_li(li) {
        var path = li.getAttribute('path')
        audio.src = '/audio/' + path;
        audio.play();
        $('#song').text(li.textContent)
    }
    function handle_next(e) {

        if (curEl?.getAttribute('path').includes("SESSION")) {
            console.log('SESISON')
            var nextLi = curEl.parentElement.parentElement.nextElementSibling;
            if (nextLi) {
                handle_play(nextLi.children[0].children[1]);
                return
            }
            var firstLi = document.getElementById('PLAY-SESSION').children[1].children[0]
            handle_play(firstLi.children[0].children[1]);
        }

    }

    function playMany(e) {
        var ul = document.getElementById('PLAY-SESSION')?.children[1]?.children[0]?.children[0]?.children[1]
        console.log(ul)
        console.log(ul.getAttribute('path'))

    }
    function weeksBetween(d1, d2) {
        console.log('start: ',d1)
        console.log('DAYS: ', Math.round((d2 - d1) / (24 * 60 * 60 * 1000)))
        return Math.round((d2 - d1) / (7 * 24 * 60 * 60 * 1000)) + 1;
    }
    function getIcon(icon){
        switch (icon){
            case 'folder':
                var folder = document.createElement('i')
                folder.className ="far fa-folder me-2";
                return folder;
            case 'play':
                var aud = document.createElement('img')
                aud.setAttribute('src', "assets/img/play-solid.svg");
                aud.setAttribute('width', "10px");
                aud.className ="me-2";
                return  aud;
        }
    }
    const getData = async () => {
        var curWeek ='Week-' + weeksBetween( new Date(2023, 11-1, 27), new Date())
        console.log(curWeek)

        try {
            const res = await fetch('/api/data' , {
                method: 'GET'
            });
            if (!res.ok) {
                throw new Error("Failed to fetch Recorders List");
            }
            var data = await res.json()

            var playlist = document.getElementById('playlist')

            for (var i = 0; i < data.length; i++) {
                var line = data[i].split('/')

                for (var j = 0; j < line.length ; j++) {
                    var id = line.slice(0, j+1).join('/')

                    if(document.getElementById(id)) {
                        //skip if element exist
                        continue;
                    }
                    var folder = getIcon('folder')
                    var aud = getIcon('play')
                    var text = document.createElement('span')

                    var li = document.createElement('li')
                    li.className = 'nav-item'
                    li.setAttribute('id', id)

                    if(j === 0) { //first iteration attach to main
                        var a = document.createElement('a')
                        text.textContent = line[j]
                        var collapsed =  (line[j] === curWeek || line[j] === 'PLAY-SESSION') ? 'collapsed' :'';
                        a.className = 'nav-link dropdown-indicator ' + collapsed

                        a.setAttribute('href', '#ul-' + i + '-' + line[j])
                        a.setAttribute('data-bs-toggle', "collapse")
                        a.appendChild(folder)
                        a.appendChild(text)

                        li.appendChild(a)
                        playlist.appendChild(li)
                    }else {
                        var parId = line.slice(0, j).join('/')
                        var parLi = document.getElementById(parId)
                        var a = document.createElement('a')
                        a.className = 'nav-link'

                        if( line.length-1 > j ) {
                            text.textContent = line[j]

                            a.classList.add('dropdown-indicator')
                            a.setAttribute('href', '#ul-' + i + '-' + line[j])
                            a.setAttribute('data-bs-toggle', "collapse")
                            a.appendChild(folder)
                            a.appendChild(text)
                        }else {
                            // last
                            text.textContent = line[j].split('.')[0]
                            text.setAttribute('path', data[i])
                            text.addEventListener('click', (e)=>handle_play(e.target))

                            a.appendChild(aud)
                            a.appendChild(text)
                        }




                        if(!parLi.children[1]){
                            var ul = document.createElement('ul')
                            ul.setAttribute('id', 'ul-' + i + '-' + line[j-1])
                            var show =  (line[j-1] === curWeek || line[j-1] === 'PLAY-SESSION')? 'show' : ''
                            ul.className='nav collapse ' + show
                            li.appendChild(a)

                            if( line.length-1 === j) {
                                attachHead(ul)
                            }
                            ul.appendChild(li)
                            parLi.appendChild(ul)
                            // console.log(parLi)
                            if(j === line.length-1) {
                                var nextLine = data[i + 1].split('/')
                                if (line[j - 1] !== nextLine[nextLine.length-2]) {
                                    attachLast(parLi.children[1])
                                }
                            }
                            continue;
                        }

                        li.appendChild(a)
                        parLi.children[1].appendChild(li)
                        if(j === line.length-1) { //last
                            if(!data[i + 1]){
                                attachLast(parLi.children[1])
                                continue;
                            }
                            var nextLine = data[i + 1].split('/')
                            if (line[j - 1] !== nextLine[nextLine.length-2]) {
                                attachLast(parLi.children[1])
                            }
                        }
                    }
                }
            }
            var el = document.getElementById('audio')
            el.addEventListener('ended', handle_next)



                // SPASE KEY
                document.addEventListener('keyup', event => {
                    if (event.code === 'Space') {
                        if (audio.paused) {
                            audio.play()
                        } else {
                            audio.pause()
                        }
                    }
                })

        } catch (error) {
            console.log("Error loading Recorders List: ", error);
        }
    };

    function attachHead (ul) {
        if(ul.id.includes('SESSION')){
            return;
        }
        var items = [
            {text:'name1', path:'path1'},
            {text:'name2', path:'path2'}
        ]
        for (var i = 0; i < items.length; i++) {

            var aud = getIcon('play')

            var text = document.createElement('span')
            text.textContent = items[i].text.split('.')[0]
            text.setAttribute('path', items[i].path)
            text.addEventListener('click', (e)=>handle_play(e.target))
            var a = document.createElement('a');
            a.className = "nav-link"
            a.appendChild(aud)
            a.appendChild(text)

            var li = document.createElement('li');
            li.className = 'nav-item';
            li.appendChild(a)
            ul.appendChild(li)
        }
    }



    function attachLast (ul) {
        if(ul.id.includes('SESSION')){
            return;
        }
        var items = [
            {text:'GoodBye1', path:'path1'},
            {text:'GoodBye2', path:'path2'}
        ]
        for (var i = 0; i < items.length; i++) {

            var aud = getIcon('play')

            var text = document.createElement('span')
            text.textContent = items[i].text.split('.')[0]
            text.setAttribute('path', items[i].path)
            text.addEventListener('click', (e)=>handle_play(e.target))
            var a = document.createElement('a');
            a.className = "nav-link"
            a.appendChild(aud)
            a.appendChild(text)

            var li = document.createElement('li');
            li.className = 'nav-item';
            li.appendChild(a)
            ul.appendChild(li)
        }
    }

    export default function LeftSide() {

        getData()

        return (

            <nav className="navbar navbar-light navbar-vertical navbar-expand-xl">
                <Script id="show-banner3">
                    {`var navbarStyle = localStorage.getItem("navbarStyle");
                                if (navbarStyle && navbarStyle !== 'transparent') {
                                    document.querySelector('.navbar-vertical').classList.add(\`navbar-\${navbarStyle}\`);
                                    console.log('i work lol')
                                }`
                    }
                </Script>
                <div className="d-flex align-items-center">
                    <div className="toggle-icon-wrapper">
                        <button
                            className="btn navbar-toggler-humburger-icon navbar-vertical-toggle"
                            data-bs-toggle="tooltip"
                            data-bs-placement="left"
                            title="Toggle Navigation"
                        >
                                        <span className="navbar-toggle-icon">
                                            <span className="toggle-line"/>
                                        </span>
                        </button>
                    </div>
                    <a className="navbar-brand" href="/">
                        <div className="d-flex align-items-center py-3">
                            <img
                                className="me-2"
                                src="/assets/KindyRooLogo.png"
                                alt="radis"
                                height="80"

                            />
                        </div>
                    </a>
                </div>
                <div className="collapse navbar-collapse" id="navbarVerticalCollapse">
                    <div className="navbar-vertical-content scrollbar">

                        <ul className="navbar-nav flex-column mb-3"
                            id='playlist'
                            style={{
                                'border-radius': '20px',
                                'border-style': 'solid',
                                'border-color': 'white'
                            }}
                        >

                        </ul>
                    </div>
                </div>
            </nav>
        )
    }
