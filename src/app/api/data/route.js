import {NextResponse} from "next/server";
const fs = require('fs');
const path = require('path');

export async function GET() {
    const data = []
    const files = await fs.promises.readdir('D:/Galya_ALL/KindyRoo/KindyROOMusics/Lessons_Music', {recursive: true});
    files.forEach(file => {
        if (path.extname(file) === ".mp3") {
            console.log(file);
            data.push(file)
            return file
        }
    })
    return  NextResponse.json(data);
}
