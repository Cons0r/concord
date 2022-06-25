<script lang="ts">
    import { session } from '$app/stores';
    import { writable } from 'svelte/store';
    import { io } from 'socket.io-client';
    let ready = false;
    let message = '';
    let messagepending = ''
    let users = writable([

    ])
    let messages = writable([

    ])
    const socket = io('/', {
        auth: $session
    })

    socket.on('ready', (d)=>{
        // sync data arrays with d value.
        users.set(d.onlineusers)
        messages.set(d.messages)
        ready = true
    })
    socket.on('kick:auth', () => {
        // User was kicked due to authorization errors.
        document.location = '/auth/register'
    })
    socket.on('join', (user) => {
        users.update(u => {
            u.push(user)
            return u
        })
    })
    socket.on('leave', (user) => {
        users.update(u => {
            u.splice(u.findIndex(e => e.id === user.id), 1)
            return u
        })
    })

    function truthy(v) {
        return !!v
    }

    function send() {
        socket.emit('message', message)
        messagepending = message
        message = ''
    }

    function deletemessage(id) {
        socket.emit('delete', id)
        messages.update(m => {
            m.splice(m.findIndex(e => e.id === id), 1)
            return m
        })
    }

    socket.on('message', (e) => {
        messages.update((m) => {
            m.push(e)
            return m
        })
    })

    socket.on('showmessage', (e) => {
        messages.update((m) => {
            m.push(e)
            return m
        })
        messagepending = ''
    })
    
    socket.on('delete', (id) => {
        messages.update(m => {
            m.splice(m.findIndex(e => e.id === id), 1)
            return m
        })
    })
</script>

{#if !ready}
<div class="min-h-full min-w-full flex items-center justify-center">
    Connecting..
</div>
{:else}
<div class="min-h-full min-w-full flex flex-row">
    <div class="min-w-[10rem] max-w-[10rem] overflow-auto max-h-[95vh] h-[95vh] flex-col">
        <div>
            {$session.user.username} (You)
        </div>
        {#each $users as user}
            <a href="/u/:{user.id}">
                {user.username}
            </a>
        {/each}
    </div>
    <div class="flex-grow flex flex-col">
        <div class="flex-grow flex flex-col max-h-full overflow-auto h-[80vh]">
            {#if !$messages.length}
                <div class="opacity-25 w-full flex-grow flex flex-col items-center justify-center">
                    <div>Empty...</div>
                </div>
            {/if}
            {#each $messages as message (message.id)}
                <div class="flex flex-col group">
                    <div class="flex flex-row text-xs">
                        <div class="flex-grow">
                            {#if message?.user?.username === $session.user.username}
                                <span class="text-green-500">You</span>
                                <button class="hidden group-hover:inline absolute mx-2" on:click={_ => deletemessage(message.id)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z" />
                                    </svg>
                                </button>
                            {:else}
                                {message?.user?.username}
                            {/if}
                        </div>
                        <div class="text-slate-500">
                            {new Date(message.createdAt).toLocaleString()}
                        </div>
                    </div>
                    <div>{message.text}</div>
                </div>
            {/each}
            {#if messagepending}
            <div class="flex flex-col backdrop-blur-md backdrop-brightness-75 backdrop-opacity-40">
                <div class="flex flex-row text-xs">
                    <div class="flex-grow">
                        <span class="text-green-500">You</span>
                    </div>
                    <div class="text-slate-500">
                        Pending...
                    </div>
                </div>
                <div class="text-gray-300">{messagepending}</div>
            </div>
            {/if}
        </div>
        <form class="w-full flex flex-row min-h-[4rem] px-2" on:submit|preventDefault={send}>
            <input type="text" bind:value={message} class="flex-grow my-2 rounded-xl border-2 pl-4" placeholder="Speak As {$session.user.username}">
            <button type="submit" class="ml-4 shadow-lg" class:text-black={!truthy(message.length)} class:text-white={truthy(message.length)}>
                <div class="h-fit w-fit rounded-full p-1" class:bg-gray-50={!truthy(message.length)} class:bg-blue-200={truthy(message.length)}>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 rounded-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                </div>
            </button>
        </form>
    </div>
</div>
{/if}