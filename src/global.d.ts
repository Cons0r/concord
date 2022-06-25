/// <reference types="@sveltejs/kit" />

type User = {
    username: string,
    token: string,
    id: string
}

declare namespace App {
    interface Locals {
        user?: User
    }
  
   // interface Platform {}
  
   interface Session {
        user?: User
    }
  
   // interface Stuff {}
  }
  