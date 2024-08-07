// app/api/stories/update/[id]/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]/route";
import prisma from "@/lib/prismadb";

export async function PUT(request, { params }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id } = params;
  const updatedStory = await request.json();

  console.log("Updating story:", id, updatedStory);

  try {
    const story = await prisma.story.update({
      where: { id: id },
      data: {
        title: updatedStory.title,
        content: updatedStory.content,
        translations: updatedStory.translations,
        audioUrl: updatedStory.audioUrl,
      },
    });

    console.log("Story updated successfully:", story);
    return NextResponse.json(story);
  } catch (error) {
    console.error("Error updating story:", error);
    return NextResponse.json({ error: "Error updating story" }, { status: 500 });
  }
}