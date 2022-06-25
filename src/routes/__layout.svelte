<script>
	import '../app.css';
	import { session } from '$app/stores';
  import nightwind from '$lib/nightwind';
  import { onMount } from 'svelte';

  let { dark } = nightwind;
  onMount(() => {
    nightwind.mount()
  })

</script>

<svelte:head>
  <title>SvelteKit Auth</title>
</svelte:head>

<div class="flex flex-col h-screen w-screen max-h-screen min-h-screen bg-slate-200">
  <nav class="bg-black flex-shrink max-h-[5vh] h-[5vh] flex justify-center items-center divide-x-8 divide-transparent flex-row text-gray-50">
      <button class="absolute right-4" on:click={nightwind.newtoggle}>
        {#if $dark}
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
        {:else}
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        {/if}
      </button>
      <a href="/">Home</a>
    
      {#if !$session.user}
        <a href="/auth/login">Login</a>
        <a href="/auth/register">Register</a>
      {/if}
    
      {#if $session.user}
        <a href="/protected">Admin</a>
        <a href="/auth/logout">Log out</a>
      {/if}
  </nav>
  <div class="flex-grow">
    <slot />
  </div>
</div>


