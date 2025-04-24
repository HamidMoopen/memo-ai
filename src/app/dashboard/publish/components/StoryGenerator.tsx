'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, ChevronDown, ChevronUp, Edit2, Save } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Story {
    title: string;
    content: string;
    emotion: string;
    story_arc: {
        exposition: string;
        rising_action: string;
        climax: string;
        falling_action: string;
        resolution: string;
    };
    themes: string[];
    writing_style: string;
    metadata: {
        time_period: string;
        locations: string[];
        characters: string[];
        key_events: string[];
        tone: string;
        perspective: string;
        literary_devices: string[];
        cultural_context: string;
    };
}

interface GenerationOptions {
    writing_style: 'formal' | 'casual' | 'poetic' | 'journalistic';
    tone: 'reflective' | 'nostalgic' | 'humorous' | 'dramatic';
    perspective: 'first_person' | 'third_person';
    focus: 'personal' | 'professional' | 'family' | 'adventure';
    chapter_count: number;
}

export function StoryGenerator() {
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedStory, setGeneratedStory] = useState<{ chapters: Story[] } | null>(null);
    const [editingChapter, setEditingChapter] = useState<number | null>(null);
    const [generationOptions, setGenerationOptions] = useState<GenerationOptions>({
        writing_style: 'formal',
        tone: 'reflective',
        perspective: 'first_person',
        focus: 'personal',
        chapter_count: 1
    });

    const handleGenerateStory = async () => {
        try {
            setIsGenerating(true);
            const response = await fetch('/api/generate-story', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ options: generationOptions }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to generate story');
            }

            const story = await response.json();
            setGeneratedStory(story);
            toast.success('Story generated successfully!');
        } catch (error) {
            console.error('Error generating story:', error);
            toast.error('Failed to generate story. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleEditChapter = (chapterIndex: number) => {
        setEditingChapter(chapterIndex);
    };

    const handleSaveChapter = (chapterIndex: number, editedContent: string) => {
        if (generatedStory) {
            const updatedChapters = [...generatedStory.chapters];
            updatedChapters[chapterIndex] = {
                ...updatedChapters[chapterIndex],
                content: editedContent
            };
            setGeneratedStory({ ...generatedStory, chapters: updatedChapters });
            setEditingChapter(null);
            toast.success('Chapter saved successfully!');
        }
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Story Generation Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Writing Style</Label>
                            <Select
                                value={generationOptions.writing_style}
                                onValueChange={(value) => setGenerationOptions({ ...generationOptions, writing_style: value as GenerationOptions['writing_style'] })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="formal">Formal</SelectItem>
                                    <SelectItem value="casual">Casual</SelectItem>
                                    <SelectItem value="poetic">Poetic</SelectItem>
                                    <SelectItem value="journalistic">Journalistic</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Tone</Label>
                            <Select
                                value={generationOptions.tone}
                                onValueChange={(value) => setGenerationOptions({ ...generationOptions, tone: value as GenerationOptions['tone'] })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="reflective">Reflective</SelectItem>
                                    <SelectItem value="nostalgic">Nostalgic</SelectItem>
                                    <SelectItem value="humorous">Humorous</SelectItem>
                                    <SelectItem value="dramatic">Dramatic</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Perspective</Label>
                            <Select
                                value={generationOptions.perspective}
                                onValueChange={(value) => setGenerationOptions({ ...generationOptions, perspective: value as GenerationOptions['perspective'] })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="first_person">First Person</SelectItem>
                                    <SelectItem value="third_person">Third Person</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Focus</Label>
                            <Select
                                value={generationOptions.focus}
                                onValueChange={(value) => setGenerationOptions({ ...generationOptions, focus: value as GenerationOptions['focus'] })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="personal">Personal</SelectItem>
                                    <SelectItem value="professional">Professional</SelectItem>
                                    <SelectItem value="family">Family</SelectItem>
                                    <SelectItem value="adventure">Adventure</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Number of Chapters</Label>
                            <Input
                                type="number"
                                min="1"
                                max="10"
                                value={generationOptions.chapter_count}
                                onChange={(e) => setGenerationOptions({ ...generationOptions, chapter_count: parseInt(e.target.value) })}
                            />
                        </div>
                    </div>

                    <Button
                        onClick={handleGenerateStory}
                        disabled={isGenerating}
                        className="w-full"
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            'Generate Story'
                        )}
                    </Button>
                </CardContent>
            </Card>

            {generatedStory && (
                <Tabs defaultValue="0" className="space-y-4">
                    <TabsList className="grid w-full grid-cols-4">
                        {generatedStory.chapters.map((_, index) => (
                            <TabsTrigger key={index} value={index.toString()}>
                                Chapter {index + 1}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {generatedStory.chapters.map((chapter, index) => (
                        <TabsContent key={index} value={index.toString()}>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle>{chapter.title}</CardTitle>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => handleEditChapter(index)}
                                        >
                                            <Edit2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="prose max-w-none">
                                        <p className="text-muted-foreground">
                                            <strong>Writing Style:</strong> {chapter.writing_style}
                                        </p>
                                        <p className="text-muted-foreground">
                                            <strong>Primary Emotion:</strong> {chapter.emotion}
                                        </p>
                                        <p className="text-muted-foreground">
                                            <strong>Themes:</strong> {chapter.themes.join(', ')}
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold">Story Arc</h3>
                                        <div className="space-y-2">
                                            <div>
                                                <h4 className="font-medium">Exposition</h4>
                                                <p className="text-muted-foreground">{chapter.story_arc.exposition}</p>
                                            </div>
                                            <div>
                                                <h4 className="font-medium">Rising Action</h4>
                                                <p className="text-muted-foreground">{chapter.story_arc.rising_action}</p>
                                            </div>
                                            <div>
                                                <h4 className="font-medium">Climax</h4>
                                                <p className="text-muted-foreground">{chapter.story_arc.climax}</p>
                                            </div>
                                            <div>
                                                <h4 className="font-medium">Falling Action</h4>
                                                <p className="text-muted-foreground">{chapter.story_arc.falling_action}</p>
                                            </div>
                                            <div>
                                                <h4 className="font-medium">Resolution</h4>
                                                <p className="text-muted-foreground">{chapter.story_arc.resolution}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold">Metadata</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <h4 className="font-medium">Time Period</h4>
                                                <p className="text-muted-foreground">{chapter.metadata.time_period}</p>
                                            </div>
                                            <div>
                                                <h4 className="font-medium">Locations</h4>
                                                <p className="text-muted-foreground">{chapter.metadata.locations.join(', ')}</p>
                                            </div>
                                            <div>
                                                <h4 className="font-medium">Characters</h4>
                                                <p className="text-muted-foreground">{chapter.metadata.characters.join(', ')}</p>
                                            </div>
                                            <div>
                                                <h4 className="font-medium">Key Events</h4>
                                                <p className="text-muted-foreground">{chapter.metadata.key_events.join(', ')}</p>
                                            </div>
                                            <div>
                                                <h4 className="font-medium">Literary Devices</h4>
                                                <p className="text-muted-foreground">{chapter.metadata.literary_devices.join(', ')}</p>
                                            </div>
                                            <div>
                                                <h4 className="font-medium">Cultural Context</h4>
                                                <p className="text-muted-foreground">{chapter.metadata.cultural_context}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold">Full Story</h3>
                                        {editingChapter === index ? (
                                            <div className="space-y-2">
                                                <textarea
                                                    className="w-full min-h-[300px] p-2 border rounded-md"
                                                    value={chapter.content}
                                                    onChange={(e) => {
                                                        const updatedChapters = [...generatedStory.chapters];
                                                        updatedChapters[index] = {
                                                            ...updatedChapters[index],
                                                            content: e.target.value
                                                        };
                                                        setGeneratedStory({ ...generatedStory, chapters: updatedChapters });
                                                    }}
                                                />
                                                <Button
                                                    onClick={() => handleSaveChapter(index, chapter.content)}
                                                    className="w-full"
                                                >
                                                    <Save className="mr-2 h-4 w-4" />
                                                    Save Changes
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="prose max-w-none">
                                                {chapter.content.split('\n\n').map((paragraph, pIndex) => (
                                                    <p key={pIndex}>{paragraph}</p>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    ))}
                </Tabs>
            )}
        </div>
    );
} 