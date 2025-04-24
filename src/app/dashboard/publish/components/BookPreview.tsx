import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Eye } from "lucide-react";

interface BookPreviewProps {
    title: string;
    font: string;
    layout: string;
    coverType: string;
    coverImage: string | null;
    includePhotos: boolean;
    onDownload: () => void;
}

export function BookPreview({
    title,
    font,
    layout,
    coverType,
    coverImage,
    includePhotos,
    onDownload,
}: BookPreviewProps) {
    const getFontClass = () => {
        switch (font) {
            case "serif":
                return "font-serif";
            case "sans-serif":
                return "font-sans";
            case "monospace":
                return "font-mono";
            default:
                return "font-serif";
        }
    };

    const getLayoutClass = () => {
        switch (layout) {
            case "classic":
                return "max-w-2xl mx-auto";
            case "modern":
                return "max-w-3xl mx-auto";
            case "minimal":
                return "max-w-xl mx-auto";
            default:
                return "max-w-2xl mx-auto";
        }
    };

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Book Preview</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className={`${getLayoutClass()} ${getFontClass()} space-y-8`}>
                        {/* Cover */}
                        <div className="aspect-[2/3] w-full rounded-lg overflow-hidden bg-gray-100">
                            {coverImage ? (
                                <img
                                    src={coverImage}
                                    alt="Book Cover"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    {coverType === "hardcover" ? "Hardcover" : "Softcover"}
                                </div>
                            )}
                        </div>

                        {/* Title Page */}
                        <div className="text-center space-y-4 py-12">
                            <h1 className="text-4xl font-bold">{title}</h1>
                            <p className="text-lg text-gray-600">Your Life Stories</p>
                        </div>

                        {/* Sample Content */}
                        <div className="prose prose-lg max-w-none">
                            <h2>Chapter 1: Early Years</h2>
                            <p>
                                This is a sample of how your stories will appear in the book.
                                The text will be formatted according to your chosen font and layout.
                                {includePhotos && (
                                    <div className="mt-4 aspect-video w-full rounded-lg overflow-hidden bg-gray-100">
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            Photo Placeholder
                                        </div>
                                    </div>
                                )}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end space-x-4">
                <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => window.open("/preview", "_blank")}
                >
                    <Eye className="h-4 w-4" />
                    View Full Preview
                </Button>
                <Button
                    className="flex items-center gap-2 bg-[#3c4f76] hover:bg-[#2a3b5a] text-white"
                    onClick={onDownload}
                >
                    <Download className="h-4 w-4" />
                    Download PDF
                </Button>
            </div>
        </div>
    );
} 