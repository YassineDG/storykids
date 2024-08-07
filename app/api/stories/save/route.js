// app/api/stories/save/route.js

import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "@/lib/prismadb";

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { title, content, translations, audioUrl } = await req.json();

  try {
    const story = await prisma.story.create({
      data: {
        title,
        content,
        translations,
        audioUrl,
        userId: session.user.id,
      },
    });

    return NextResponse.json(story);
  } catch (error) {
    console.error("Error saving story:", error);
    return NextResponse.json({ error: "Error saving story" }, { status: 500 });
  }
}