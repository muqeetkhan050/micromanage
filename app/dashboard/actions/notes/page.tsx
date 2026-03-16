

// "use client"

// import { useEffect, useState } from "react"

// export default function MyIssues(){

// const [issues,setIssues] = useState([])

// useEffect(()=>{

// fetch("/api/my-issues")
// .then(res=>res.json())
// .then(data=>setIssues(data))

// },[])

// return(

// <div className="p-6">

// <h1 className="text-xl font-bold mb-6">
// My Assigned Issues
// </h1>

// {issues.map((issue:any)=>(
// <div
// key={issue._id}
// className="border p-4 mb-4 rounded"
// >

// <h2 className="font-semibold">
// {issue.title}
// </h2>

// <p>
// {issue.description}
// </p>

// </div>
// ))}

// </div>

// )

// }

"use client"

import { useEffect, useState } from "react"

export default function MyIssues(){

const [issues,setIssues] = useState<any[]>([])

useEffect(()=>{

fetch("/api/my-issues",{
headers:{
Authorization:`Bearer ${localStorage.getItem("token")}`
}
})
.then(res=>res.json())
.then(data=>{

if(Array.isArray(data)){
setIssues(data)
}else{
setIssues([])
console.log("API returned:",data)
}

})

},[])

return(

<div className="p-6">

<h1 className="text-xl font-bold mb-6">
My Assigned Issues
</h1>

{issues.length === 0 && (
<p className="text-gray-500">
No issues assigned to you
</p>
)}

{issues.map((issue)=>(
<div
key={issue._id}
className="border p-4 mb-4 rounded"
>

<h2 className="font-semibold">
{issue.title}
</h2>

<p>
{issue.description}
</p>

</div>
))}

</div>

)

}