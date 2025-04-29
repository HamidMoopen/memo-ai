import { Document, Page, Text, View, Image, StyleSheet, Font } from '@react-pdf/renderer';
import { createClient } from '@/lib/supabase/client';

// Register fonts
Font.register({
    family: 'Serif',
    src: 'https://fonts.gstatic.com/s/merriweather/v30/u-440qyriQwlOrhSvowK_l5-fCZM.woff2',
});

Font.register({
    family: 'Sans',
    src: 'https://fonts.gstatic.com/s/opensans/v35/memvYaGs126MiZpBA-UvWbX2vVnXBbObj2OVTS-muw.woff2',
});

Font.register({
    family: 'Mono',
    src: 'https://fonts.gstatic.com/s/robotomono/v22/L0x5DF4xlVMF-BfR8bXMIjhLq3-cXbKDO1w.woff2',
});

const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontFamily: 'Serif',
    },
    cover: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    titlePage: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 100,
    },
    title: {
        fontSize: 36,
        marginBottom: 20,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 18,
        color: '#666',
        textAlign: 'center',
    },
    content: {
        fontSize: 12,
        lineHeight: 1.5,
        marginTop: 20,
    },
    chapterTitle: {
        fontSize: 24,
        marginTop: 30,
        marginBottom: 10,
    },
    photo: {
        width: '100%',
        marginTop: 10,
        marginBottom: 10,
    },
});

interface BookPDFProps {
    title: string;
    font: string;
    layout: string;
    coverType: string;
    coverImage: string | null;
    includePhotos: boolean;
    stories: any[]; // We'll need to fetch the user's stories
}

export function BookPDF({
    title,
    font,
    layout,
    coverType,
    coverImage,
    includePhotos,
    stories,
}: BookPDFProps) {
    const getFontFamily = () => {
        switch (font) {
            case 'serif':
                return 'Serif';
            case 'sans-serif':
                return 'Sans';
            case 'monospace':
                return 'Mono';
            default:
                return 'Serif';
        }
    };

    return (
        <Document>
            {/* Cover Page */}
            <Page size="A5" style={[styles.page, { fontFamily: getFontFamily() }]}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    {coverImage ? (
                        <Image src={coverImage} style={styles.cover} />
                    ) : (
                        <Text style={{ fontSize: 24, color: '#666' }}>
                            {coverType === 'hardcover' ? 'Hardcover' : 'Softcover'}
                        </Text>
                    )}
                </View>
            </Page>

            {/* Title Page */}
            <Page size="A5" style={[styles.page, { fontFamily: getFontFamily() }]}>
                <View style={styles.titlePage}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.subtitle}>Your Life Stories</Text>
                </View>
            </Page>

            {/* Content Pages */}
            {stories.map((story, index) => (
                <Page key={index} size="A5" style={[styles.page, { fontFamily: getFontFamily() }]}>
                    <Text style={styles.chapterTitle}>Chapter {index + 1}: {story.title}</Text>
                    <Text style={styles.content}>{story.content}</Text>
                    {includePhotos && story.photos?.map((photo: string, photoIndex: number) => (
                        <Image key={photoIndex} src={photo} style={styles.photo} />
                    ))}
                </Page>
            ))}
        </Document>
    );
} 