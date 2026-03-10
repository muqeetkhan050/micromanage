import {NextResponse} from "next/server"
import { connectDB } from "@/lib/db";
import {Issue } from "@/lib/models/issue";




export async function POST(req:Request){
    try{
        const {title, description} =await req.json();
        await connectDB();
        await Issue.create({
            title,
            description     

            
        })
        return NextResponse.json({message: "Issue created successfully"});
    } catch (error) {
        console.error("Error creating issue:", error);
        return NextResponse.json({message: "Error creating issue"}, {status: 500});
    }
}


export async function GET(req:Request){
    try{
        await connectDB();
        const issues=await Issue.find();    
        return NextResponse.json(issues);   
    }catch (error) {
        console.error("Error fetching issues:", error);
        return NextResponse.json({message: "Error fetching issues"}, {status: 500});
    }
}