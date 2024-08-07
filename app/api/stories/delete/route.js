import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "@/lib/prismadb";

export async function DELETE(request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const url = new URL(request.url);
  const id = url.searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: "Story ID is required" }, { status: 400 });
  }

  try {
    const story = await prisma.story.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!story) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }

    if (story.userId !== session.user.id) {
      return NextResponse.json({ error: "Not authorized to delete this story" }, { status: 403 });
    }

    await prisma.story.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Story deleted successfully" });
  } catch (error) {
    console.error("Error deleting story:", error);
    return NextResponse.json({ error: "Error deleting story" }, { status: 500 });
  }
}