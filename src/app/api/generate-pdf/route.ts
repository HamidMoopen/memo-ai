import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { PDFDocument, StandardFonts } from 'pdf-lib';
import { LifeChapter } from '@/types/story';

interface Story {
    id: string;
    title: string;
    content: string;
    created_at: string;
    user_id: string;
    life_chapter: LifeChapter | null;
}

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Parse and validate request body
        let body;
        try {
            body = await request.json();
        } catch (e) {
            return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
        }

        const { title = 'My Stories' } = body;

        // Fetch user's stories
        const { data: stories, error } = await supabase
            .from('stories')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: true });

        if (error) {
            console.error('Error fetching stories:', error);
            return NextResponse.json({ error: 'Failed to fetch stories' }, { status: 500 });
        }

        if (!stories || stories.length === 0) {
            return NextResponse.json(
                { error: 'No stories found' },
                { status: 404 }
            );
        }

        // Create a new PDF document
        const pdfDoc = await PDFDocument.create();
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        let currentPage = pdfDoc.addPage([595.28, 841.89]); // A4 size

        // Add content to the PDF
        const { width, height } = currentPage.getSize();
        currentPage.drawText(title, {
            x: 50,
            y: height - 50,
            size: 30,
            font
        });

        // Add stories content
        let y = height - 100;
        (stories as Story[]).forEach((story, index) => {
            if (y < 100) {
                currentPage = pdfDoc.addPage([595.28, 841.89]);
                y = height - 50;
            }

            // Draw chapter title
            currentPage.drawText(`Chapter ${index + 1}: ${story.title}`, {
                x: 50,
                y,
                size: 20,
                font
            });
            y -= 30;

            // Add life chapter if it exists
            if (story.life_chapter) {
                currentPage.drawText(`Life Chapter: ${story.life_chapter}`, {
                    x: 50,
                    y,
                    size: 14,
                    font
                });
                y -= 25;
            }

            // Split content into lines and add to PDF
            const contentLines = story.content.split('\n');
            for (const line of contentLines) {
                // Check if we need a new page
                if (y < 50) {
                    currentPage = pdfDoc.addPage([595.28, 841.89]);
                    y = height - 50;
                }

                // Handle empty lines
                if (line.trim() === '') {
                    y -= 20;
                    continue;
                }

                // Draw the text
                currentPage.drawText(line.trim(), {
                    x: 50,
                    y,
                    size: 12,
                    font
                });
                y -= 20;
            }

            // Add space between stories
            y -= 40;
        });

        // Save the PDF
        const pdfBytes = await pdfDoc.save();

        // Return the PDF as a response
        return new NextResponse(pdfBytes, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename="book.pdf"',
            },
        });
    } catch (error) {
        console.error('Error generating PDF:', error);
        return NextResponse.json(
            { error: 'Failed to generate PDF', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
} 