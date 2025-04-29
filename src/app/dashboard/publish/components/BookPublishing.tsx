"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { ImageUpload } from "@/components/ui/image-upload";
import { BookPreview } from "./BookPreview";
import { toast } from "sonner";
import { StoryGenerator } from './StoryGenerator';

const fontOptions = [
    { value: "serif", label: "Serif (Traditional)" },
    { value: "sans-serif", label: "Sans Serif (Modern)" },
    { value: "monospace", label: "Monospace (Typewriter)" },
];

const layoutOptions = [
    { value: "classic", label: "Classic" },
    { value: "modern", label: "Modern" },
    { value: "minimal", label: "Minimal" },
];

const coverOptions = [
    { value: "hardcover", label: "Hardcover" },
    { value: "softcover", label: "Softcover" },
];

export function BookPublishing() {
    const [title, setTitle] = useState("");
    const [selectedFont, setSelectedFont] = useState("serif");
    const [selectedLayout, setSelectedLayout] = useState("classic");
    const [selectedCover, setSelectedCover] = useState("hardcover");
    const [includePhotos, setIncludePhotos] = useState(false);
    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
    const [showPreview, setShowPreview] = useState(false);

    const handleImageSelect = (file: File | null) => {
        setCoverImage(file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCoverImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setCoverImagePreview(null);
        }
    };

    const handleSubmit = async () => {
        if (!title.trim()) {
            toast.error("Please enter a book title");
            return;
        }
        setShowPreview(true);
    };

    const handleDownload = async () => {
        try {
            const response = await fetch('/api/generate-pdf', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title,
                    font: selectedFont,
                    layout: selectedLayout,
                    coverType: selectedCover,
                    coverImage,
                    includePhotos,
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to generate PDF');
            }

            // Create a blob from the response
            const blob = await response.blob();
            
            // Create a download link
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${title.toLowerCase().replace(/\s+/g, '-')}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

            toast.success('Book downloaded successfully!');
        } catch (error) {
            console.error('Error downloading book:', error);
            toast.error('Failed to download book. Please try again.');
        }
    };

    if (showPreview) {
        return (
            <div className="space-y-8">
                <Button
                    variant="ghost"
                    className="text-[#3c4f76] hover:bg-[#3c4f76]/10"
                    onClick={() => setShowPreview(false)}
                >
                    ← Back to settings
                </Button>
                <BookPreview
                    title={title}
                    font={selectedFont}
                    layout={selectedLayout}
                    coverType={selectedCover}
                    coverImage={coverImagePreview}
                    includePhotos={includePhotos}
                    onDownload={handleDownload}
                />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <StoryGenerator />
            
            <Card>
                <CardHeader>
                    <CardTitle>Book Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="title">Book Title</Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter your book title"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Font Style</Label>
                        <Select value={selectedFont} onValueChange={setSelectedFont}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select font style" />
                            </SelectTrigger>
                            <SelectContent>
                                {fontOptions.map((font) => (
                                    <SelectItem key={font.value} value={font.value}>
                                        {font.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Layout Style</Label>
                        <Select value={selectedLayout} onValueChange={setSelectedLayout}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select layout style" />
                            </SelectTrigger>
                            <SelectContent>
                                {layoutOptions.map((layout) => (
                                    <SelectItem key={layout.value} value={layout.value}>
                                        {layout.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Cover Type</Label>
                        <RadioGroup value={selectedCover} onValueChange={setSelectedCover}>
                            {coverOptions.map((cover) => (
                                <div key={cover.value} className="flex items-center space-x-2">
                                    <RadioGroupItem value={cover.value} id={cover.value} />
                                    <Label htmlFor={cover.value}>{cover.label}</Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </div>

                    <div className="space-y-2">
                        <Label>Cover Image</Label>
                        <ImageUpload
                            onImageSelect={handleImageSelect}
                            maxSize={5 * 1024 * 1024} // 5MB
                            accept="image/*"
                        />
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="includePhotos"
                            checked={includePhotos}
                            onCheckedChange={(checked) => setIncludePhotos(checked as boolean)}
                        />
                        <Label htmlFor="includePhotos">Include photos and memorabilia</Label>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button
                    onClick={handleSubmit}
                    className="bg-[#3c4f76] hover:bg-[#2a3b5a] text-white"
                    disabled={!title.trim()}
                >
                    Preview Book
                </Button>
            </div>
        </div>
    );
} 