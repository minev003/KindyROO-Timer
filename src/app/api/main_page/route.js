// kriptirane tuk + proverka v baza dannite (server chast) 
// min width na container for RADIS LOGIN PAGE
// COOKIES ot next js v baza ot danni, tablica za aktivni sesii

//us['password'] = crypto.createHmac('sha256', HMACK_KEY).update(us['password']).digest('hex');

import { NextResponse, NextRequest} from "next/server";
const crypto = require('node:crypto');
const HMACK_KEY = 'Monika';
import { prisma } from "@/db";

async function getallUsersCredentialsInfoFunc() {
    "use server"
    return prisma.radisUsers.findMany()
}

console.log('\n', '\n', '\n')
let users = await getallUsersCredentialsInfoFunc()
//console.log('users-> ', users)
// USERS CORRECTLY READS THE DATABASE

export async function GET(req, res) {
    console.log('GET Slugging:', res.params);
    return NextResponse.json({ hello: 'world' });
}

export async function POST(req, res) {
    // console.log('POST REQ Slugging:', req.params.slug);
    // console.log('POST RES Slugging:', res.params.slug);

    let buffer = '';

    // req.on('data', function (data) {
    //     buffer += data;
    // });

    // req.on('end', function () {
    //     var receiveData = JSON.parse(buffer);
    //     console.log('receiveData -> ', receiveData);
    // });

    const reqPar = await req.params;
    const resPar = await res.params;

    console.log('POST req', reqPar);
    console.log('POST res', resPar);
    console.log(JSON.stringify(req).indexOf('mmmmmmm'))
    const bod = await req.body;
    console.log(bod)

    console.log(await NextRequest.req)
    
    if (users != undefined) {
        let arrayUsersCredentialsInfo = [];
        arrayUsersCredentialsInfo = users.map(function (user) {
            // const obj = {
            //     id: string,
            //     username: string,
            //     password: string
            // };
            // console.log('user -> ', user);
            // console.log('user.id -> ', user.id);
            // console.log('user.username -> ', user.username);
            // console.log('user.password -> ', user.password);
    
            // console.log('user.password crypto -> ', user.password);
    
        })
    }

    return NextResponse.json({ hello: 'POST world' });
}

// export default function handler(req,res){
//     if(req.method === 'POST'){
//         const comment = req.body.comment
//         console.log(comment)
//         res.status(200).json(comment)
//     }
// }

// async function updateUsersPasswords() {
//     "use server"
    
//     await prisma.radisUsers.update({
//         where: {
//             id: 'f5c2de71-ffb7-4a53-b291-f9a31e4421d9'
//         },
//         data: {
//             password: crypto.createHmac('sha256', HMACK_KEY).update('moni').digest('hex'),
//         },
//     })

//     await prisma.radisUsers.update({
//         where: {
//             id: 'cdb9a4ba-b230-4f4d-9020-db247932b475'
//         },
//         data: {
//             password: crypto.createHmac('sha256', HMACK_KEY).update('test').digest('hex'),
//         },
//     })

//     await prisma.radisUsers.update({
//         where: {
//             id: 'c7db87c2-dab2-42a5-b52d-647a9ea4165f'
//         },
//         data: {
//             password: crypto.createHmac('sha256', HMACK_KEY).update('sadmin').digest('hex'),
//         },
//     })
// }