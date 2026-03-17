
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Organisation } from "@/lib/models/Organisation";
import { User } from "@/lib/models/User";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    await connectDB();

    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { name, action } = await req.json();

    if (!name) {
      return NextResponse.json(
        { message: "Organisation name required" },
        { status: 400 }
      );
    }

    const org = await Organisation.findOne({ name });

    if (action === "create") {
      if (org) {
        return NextResponse.json(
          { message: "Organisation name is already taken" },
          { status: 400 }
        );
      }

      const newOrg = await Organisation.create({ name });

      await User.findByIdAndUpdate(session.user.id, {
        organisationId: newOrg._id,
      });

      return NextResponse.json(newOrg);
    }

    if (action === "join") {
      if (!org) {
        return NextResponse.json(
          { message: "Organisation not found" },
          { status: 404 }
        );
      }

      await User.findByIdAndUpdate(session.user.id, {
        organisationId: org._id,
      });

      return NextResponse.json(org);
    }

    return NextResponse.json({ message: "Invalid action" }, { status: 400 });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}