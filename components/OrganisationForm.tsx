"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function OrganisationForm() {
  const [orgName, setOrgName] = useState("");
  const [action, setAction] = useState<"create" | "join">("join");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!orgName) {
      toast.error("Organisation name is required");
      return;
    }

    try {
      const res = await fetch("/api/organisation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: orgName, action }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed");
        return;
      }

      toast.success(
        action === "create"
          ? `Organisation "${data.name}" created!`
          : `Joined organisation "${data.name}"!`
      );

      setOrgName("");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6 bg-white rounded-md shadow-md w-full max-w-md">
      <h1 className="text-xl font-bold">Organisation</h1>

      <Input
        placeholder="Organisation name"
        value={orgName}
        onChange={(e) => setOrgName(e.target.value)}
        required
      />

      <div className="flex gap-4 items-center">
        <label className="flex items-center gap-1">
          <input
            type="radio"
            name="action"
            value="join"
            checked={action === "join"}
            onChange={() => setAction("join")}
          />
          Join Existing
        </label>

        <label className="flex items-center gap-1">
          <input
            type="radio"
            name="action"
            value="create"
            checked={action === "create"}
            onChange={() => setAction("create")}
          />
          Create New
        </label>
      </div>

      <Button type="submit" className="bg-black text-white">
        {action === "create" ? "Create Organisation" : "Join Organisation"}
      </Button>
    </form>
  );
}