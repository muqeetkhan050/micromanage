

"use client";

import { useState } from "react";
import { LoginForm } from '@/components/login-form';
import { SignupForm } from '@/components/signup-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-black font-sans p-4">
      
      <Tabs defaultValue="login" className="w-full max-w-md">
        <TabsList>
          <TabsTrigger value="signup">Signup</TabsTrigger>
          <TabsTrigger value="login">Login</TabsTrigger>
        </TabsList>


        <TabsContent value="signup">
          <div className="mt-4">
            <SignupForm />
          </div>
        </TabsContent>

        <TabsContent value="login">
          <div className="mt-4">
            <LoginForm />
          </div>
        </TabsContent>
      </Tabs>

    </div>
  );
}