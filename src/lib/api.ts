type Data = Promise<{
	error?: string
	success?: string
    // defined in src/global.d.ts
	user?: User
}>
  
  export async function send(form: HTMLFormElement): Data {
	const response = await fetch(form.action, {
		method: form.method,
		body: new FormData(form),
		headers: { accept: 'application/json' },
	})
	return await response.json()
  }
  