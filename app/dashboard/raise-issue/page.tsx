'use client'
import { useState } from "react"
export default function RaiseIssuePage(){

    const [title, setTitle]=useState('')
    const [descrition, setDescription]=useState('')
    const [error, setError]=useState('')

    const  handleSubmit=(e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault()

         if (!title) {
    setError('Please write your title')  
    return                               
  }
  if (!descrition) {
    setError('Please write description')
    return
  }
    






    }

    
    return (
        <div>
            <form onSubmit={handleSubmit}>
          <h1 className="text-xl font-bold">what issue are you facing?</h1>
          <p>Group chat will appear here.</p>
          <div className="flex flex-col gap-4 mt-4">
            <input value={title} name="issueTitle" placeholder="Enter issue title..." className="border border-gray-300 rounded-md p-2" />
            <input value={descrition} name="issueDescription" placeholder="Describe your issue..." className="border border-gray-300 rounded-md p-2 h-32" />
            <button type='submit' className="bg-blue-500 text-white rounded-md px-4 py-2">Submit Issue</button>

          </div>
          </form>
        </div>
    )
}
