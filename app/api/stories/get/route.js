import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "@/lib/prismadb";

export async function GET(request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '9');
  const skip = (page - 1) * limit;

  try {
    const [stories, totalStories] = await Promise.all([
      prisma.story.findMany({
        where: {
          userId: session.user.id,
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: skip,
        take: limit,
      }),
      prisma.story.count({
        where: {
          userId: session.user.id,
        },
      }),
    ]);

    const totalPages = Math.ceil(totalStories / limit);

    return NextResponse.json({
      stories,
      totalPages,
      currentPage: page,
      totalStories,
    });
  } catch (error) {
    console.error("Error fetching stories:", error);
    return NextResponse.json({ error: "Error fetching stories" }, { status: 500 });
  }
}