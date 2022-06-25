// This file should include all of your socket.io server things
import * as client from '@prisma/client';

const prisma = new client.PrismaClient();

export async function realtimeapp(io) {
    const onlineusers = []
    const messages = await prisma.message.findMany({
        select: {
            id: true,
            text: true,
            user: {
                select: {
                    hash: false,
                    id: true,
                    username: true
                }
            },
            createdAt: true
        }
    })
    messages.map((m) => m.message)
    io.on('connection', async(s)=>{
        let user;
        try {
            user = await prisma.user.findUnique({
                where: {
                    token: s.handshake.auth.user.token
                },
                select: {
                    id: true,
                    username: true,
                    token: true,
                    hash: false
                }
            })
            // code that is run after this means the user is authenticated
            let publicuser = {
                token: undefined,
                ...user
            }
            s.emit('ready', {
                onlineusers, messages
            })
            onlineusers.push(publicuser)
            s.broadcast.emit('join', publicuser)
            s.on('disconnecting', ()=>{
                onlineusers.splice(onlineusers.findIndex(e => e === publicuser), 1)
                s.broadcast.emit('leave', publicuser)
            })
        } catch {
            // user is not authorized to join
            s.emit('kick:auth')
            s.disconnect()
            return
        }
        s.on('delete', async(m) => {
            await prisma.message.delete({
                where: {
                    id: m
                }
            })
            messages.splice(messages.findIndex(e => e.id === m), 1)
            s.broadcast.emit('delete', m)
        })
        s.on('message', async(m) => {
            let message = await prisma.message.create({
                data: {
                    text: m,
                    user: {
                        connect: {
                            token: user.token
                        }
                    }
                },
                select: {
                    id: true,
                    text: true,
                    user: {
                        select: {
                            hash: false,
                            id: true,
                            username: true
                        }
                    },
                    createdAt: true
                }
            })
            messages.push(message)
            s.broadcast.emit('message', message)
            s.emit('showmessage', message)
        })
    })
}