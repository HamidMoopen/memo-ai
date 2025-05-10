import { BookPublishing } from "../components/BookPublishing";

export default function PrintedMemoirPage() {
  return (
    <div className="min-h-screen bg-background py-12 px-4 flex flex-col items-center">
      <div className="w-full max-w-2xl">
        <BookPublishing />
      </div>
    </div>
  );
} 